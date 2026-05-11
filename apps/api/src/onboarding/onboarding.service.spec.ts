import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BadRequestException } from "@nestjs/common";

import { ProfileRelationship } from "../generated/prisma/client";
import { OnboardingService } from "./onboarding.service";

describe("OnboardingService", () => {
  const transactionMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userProfile: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    checkupType: {
      findMany: jest.fn(),
    },
    profile: {
      create: jest.fn(),
    },
    profileCheckup: {
      create: jest.fn(),
    },
    checkupRecord: {
      create: jest.fn(),
    },
  };

  const prismaServiceMock = {
    $transaction: jest.fn(
      async (
        callback: (transaction: typeof transactionMock) => Promise<unknown>,
      ) => callback(transactionMock),
    ),
  };

  let onboardingService: OnboardingService;

  beforeEach(() => {
    jest.clearAllMocks();
    onboardingService = new OnboardingService(prismaServiceMock as never);

    transactionMock.user.findUnique.mockResolvedValue(null);
    transactionMock.user.create.mockResolvedValue({
      id: "app-user-id",
      authUserId: "auth-user-id",
      email: "user@example.com",
      expoPushToken: "ExponentPushToken[abc]",
    });
    transactionMock.user.update.mockImplementation(
      () => Promise.resolve({
        id: "app-user-id",
        authUserId: "auth-user-id",
        email: "updated@example.com",
        expoPushToken: "ExponentPushToken[updated]",
      }),
    );
    transactionMock.userProfile.count.mockResolvedValue(0);
    transactionMock.checkupType.findMany.mockResolvedValue([
      {
        id: "checkup-type-dentistry",
        slug: "dentistry",
      },
      {
        id: "checkup-type-cardiology",
        slug: "cardiology",
      },
    ]);
    transactionMock.profile.create.mockResolvedValue({
      id: "profile-id",
    });
    transactionMock.userProfile.create.mockResolvedValue({
      id: "user-profile-id",
    });
    transactionMock.profileCheckup.create
      .mockResolvedValueOnce({
        id: "profile-checkup-dentistry",
      })
      .mockResolvedValueOnce({
        id: "profile-checkup-cardiology",
      });
    transactionMock.checkupRecord.create.mockResolvedValue({
      id: "checkup-record-id",
    });
    transactionMock.userProfile.findMany.mockResolvedValue([
      {
        profile: {
          id: "profile-id",
          name: "Me",
          relationship: ProfileRelationship.SELF,
          checkups: [
            {
              id: "profile-checkup-dentistry",
              checkupType: {
                slug: "dentistry",
              },
            },
            {
              id: "profile-checkup-cardiology",
              checkupType: {
                slug: "cardiology",
              },
            },
          ],
        },
      },
    ]);
  });

  it("creates a new internal user from the authenticated auth user id", async () => {
    const response = await onboardingService.finalize(
      {
        id: "auth-user-id",
        email: "user@example.com",
        claims: {} as never,
      },
      {
        expoPushToken: "ExponentPushToken[abc]",
        profiles: [
          {
            relationship: "SELF",
            name: "Me",
            birthDate: "1990-05-15",
            biologicalSex: "MALE",
            healthInfo: {
              riskFactors: {
                smoker: false,
                hasHypertension: true,
                hasFamilyHistory: false,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 180,
              },
              {
                checkupTypeSlug: "cardiology",
                frequencyDays: 365,
              },
            ],
          },
        ],
      },
    );

    expect(transactionMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          authUserId: "auth-user-id",
          email: "user@example.com",
          expoPushToken: "ExponentPushToken[abc]",
        }),
      }),
    );
    expect(response).toEqual({
      userId: "app-user-id",
      status: "created",
      alreadyFinalized: false,
      profiles: [
        {
          id: "profile-id",
          name: "Me",
          relationship: "SELF",
          checkups: [
            {
              id: "profile-checkup-dentistry",
              checkupTypeSlug: "dentistry",
            },
            {
              id: "profile-checkup-cardiology",
              checkupTypeSlug: "cardiology",
            },
          ],
        },
      ],
    });
  });

  it("updates existing user email and push token before returning existing onboarding data", async () => {
    transactionMock.user.findUnique.mockResolvedValue({
      id: "app-user-id",
      authUserId: "auth-user-id",
      email: null,
      expoPushToken: null,
    });
    transactionMock.userProfile.count.mockResolvedValue(1);

    const response = await onboardingService.finalize(
      {
        id: "auth-user-id",
        email: "updated@example.com",
        claims: {} as never,
      },
      {
        expoPushToken: "ExponentPushToken[updated]",
        profiles: [
          {
            relationship: "SELF",
            name: "Me",
            birthDate: "1990-05-15",
            biologicalSex: "MALE",
            healthInfo: {
              riskFactors: {
                smoker: false,
                hasHypertension: true,
                hasFamilyHistory: false,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 180,
              },
            ],
          },
        ],
      },
    );

    expect(transactionMock.user.update).toHaveBeenCalledWith({
      where: {
        id: "app-user-id",
      },
      data: {
        email: "updated@example.com",
        expoPushToken: "ExponentPushToken[updated]",
      },
    });
    expect(response.status).toBe("existing");
    expect(response.alreadyFinalized).toBe(true);
  });

  it("rejects checkup slugs that are missing from the seeded database catalog", async () => {
    transactionMock.checkupType.findMany.mockResolvedValue([]);

    await expect(
      onboardingService.finalize(
        {
          id: "auth-user-id",
          email: "user@example.com",
          claims: {} as never,
        },
        {
          profiles: [
            {
              relationship: "SELF",
              name: "Me",
              birthDate: "1990-05-15",
              biologicalSex: "MALE",
              healthInfo: {
                riskFactors: {
                  smoker: false,
                  hasHypertension: true,
                  hasFamilyHistory: false,
                },
              },
              checkups: [
                {
                  checkupTypeSlug: "dentistry",
                  frequencyDays: 180,
                },
              ],
            },
          ],
        },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it("creates an initial checkup record only when one was provided", async () => {
    await onboardingService.finalize(
      {
        id: "auth-user-id",
        email: "user@example.com",
        claims: {} as never,
      },
      {
        profiles: [
          {
            relationship: "SELF",
            name: "Me",
            birthDate: "1990-05-15",
            biologicalSex: "MALE",
            healthInfo: {
              riskFactors: {
                smoker: false,
                hasHypertension: true,
                hasFamilyHistory: false,
              },
            },
            checkups: [
              {
                checkupTypeSlug: "dentistry",
                frequencyDays: 180,
                initialRecord: {
                  performedAt: "2025-10-10",
                },
              },
              {
                checkupTypeSlug: "cardiology",
                frequencyDays: 365,
              },
            ],
          },
        ],
      },
    );

    expect(transactionMock.checkupRecord.create).toHaveBeenCalledTimes(1);
    expect(transactionMock.checkupRecord.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          profileCheckupId: "profile-checkup-dentistry",
        }),
      }),
    );
  });

  it("stops the transaction flow when a profile checkup insert fails", async () => {
    transactionMock.profileCheckup.create.mockReset();
    transactionMock.profileCheckup.create.mockRejectedValue(
      new Error("profile checkup insert failed"),
    );

    await expect(
      onboardingService.finalize(
        {
          id: "auth-user-id",
          email: "user@example.com",
          claims: {} as never,
        },
        {
          profiles: [
            {
              relationship: "SELF",
              name: "Me",
              birthDate: "1990-05-15",
              biologicalSex: "MALE",
              healthInfo: {
                riskFactors: {
                  smoker: false,
                  hasHypertension: true,
                  hasFamilyHistory: false,
                },
              },
              checkups: [
                {
                  checkupTypeSlug: "dentistry",
                  frequencyDays: 180,
                  initialRecord: {
                    performedAt: "2025-10-10",
                  },
                },
              ],
            },
          ],
        },
      ),
    ).rejects.toThrow("profile checkup insert failed");

    expect(transactionMock.checkupRecord.create).not.toHaveBeenCalled();
  });
});
