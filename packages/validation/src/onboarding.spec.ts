import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOnboardingQueue,
  finalizeOnboardingRequestSchema,
  finalizeOnboardingResponseSchema,
  getRecommendedCheckupsForProfile,
  type FinalizeOnboardingRequest,
  type OnboardingProfileInput,
} from "./onboarding";

const today = new Date("2026-05-12T12:00:00.000Z");

function checkupSlugsFor(
  profile: Parameters<typeof getRecommendedCheckupsForProfile>[0],
) {
  return getRecommendedCheckupsForProfile(profile, today).map(
    (checkup) => checkup.checkupTypeSlug,
  );
}

function makeProfile(
  relationship: OnboardingProfileInput["relationship"],
  name: string,
): OnboardingProfileInput {
  if (relationship === "SELF") {
    return {
      relationship,
      name,
      birthDate: "1991-03-10",
      biologicalSex: "MALE",
      healthInfo: {
        riskFactors: {
          smoker: false,
          hasHypertension: false,
          hasFamilyHistory: false,
        },
      },
      checkups: [{ checkupTypeSlug: "dentistry", frequencyDays: 180 }],
    };
  }

  if (relationship === "PARENT") {
    return {
      relationship,
      name,
      birthDate: "1960-03-10",
      biologicalSex: "FEMALE",
      healthInfo: {
        concerns: {
          hasDiabetes: false,
          hasMobilityIssues: false,
          hasCognitiveConcerns: false,
        },
      },
      checkups: [{ checkupTypeSlug: "cardiology", frequencyDays: 180 }],
    };
  }

  return {
    relationship,
    name,
    birthDate: "2018-03-10",
    biologicalSex: "OTHER",
    healthInfo: {
      concerns: {
        hasAllergies: false,
        hasAsthma: false,
      },
    },
    checkups: [{ checkupTypeSlug: "pediatrics", frequencyDays: 180 }],
  };
}

describe("onboarding validation", () => {
  it("allows caregiver-only onboarding with two parents and no self", () => {
    const request: FinalizeOnboardingRequest = {
      profiles: [makeProfile("PARENT", "Mom"), makeProfile("PARENT", "Dad")],
    };

    assert.equal(
      finalizeOnboardingRequestSchema.safeParse(request).success,
      true,
    );
  });

  it("enforces profile caps for SELF, CHILD, and PARENT", () => {
    assert.equal(
      finalizeOnboardingRequestSchema.safeParse({
        profiles: [makeProfile("SELF", "Me"), makeProfile("SELF", "Me again")],
      }).success,
      false,
    );

    assert.equal(
      finalizeOnboardingRequestSchema.safeParse({
        profiles: [
          makeProfile("CHILD", "Child 1"),
          makeProfile("CHILD", "Child 2"),
          makeProfile("CHILD", "Child 3"),
        ],
      }).success,
      false,
    );

    assert.equal(
      finalizeOnboardingRequestSchema.safeParse({
        profiles: [
          makeProfile("PARENT", "Parent 1"),
          makeProfile("PARENT", "Parent 2"),
          makeProfile("PARENT", "Parent 3"),
        ],
      }).success,
      false,
    );
  });

  it("rejects duplicate checkups per profile", () => {
    const profile = makeProfile("SELF", "Me");
    profile.checkups = [
      { checkupTypeSlug: "dentistry", frequencyDays: 180 },
      { checkupTypeSlug: "dentistry", frequencyDays: 365 },
    ];

    assert.equal(
      finalizeOnboardingRequestSchema.safeParse({ profiles: [profile] })
        .success,
      false,
    );
  });

  it("keeps initial records optional and serializes performedAt only", () => {
    const profile = makeProfile("SELF", "Me");
    profile.checkups = [
      {
        checkupTypeSlug: "dentistry",
        frequencyDays: 180,
        initialRecord: { performedAt: "2026-01-02" },
      },
      { checkupTypeSlug: "dermatology", frequencyDays: 365 },
    ];

    const result = finalizeOnboardingRequestSchema.parse({
      profiles: [profile],
    });

    assert.deepEqual(result.profiles[0].checkups[0].initialRecord, {
      performedAt: "2026-01-02",
    });
    assert.equal(result.profiles[0].checkups[1].initialRecord, undefined);
  });

  it("accepts a valid finalize onboarding response payload", () => {
    const result = finalizeOnboardingResponseSchema.parse({
      userId: "user_123",
      status: "created",
      alreadyFinalized: false,
      profiles: [
        {
          id: "profile_123",
          name: "Jane Doe",
          relationship: "SELF",
          checkups: [{ id: "checkup_123", checkupTypeSlug: "dentistry" }],
        },
      ],
    });

    assert.equal(result.userId, "user_123");
    assert.equal(result.profiles[0]?.checkups[0]?.checkupTypeSlug, "dentistry");
  });
});

describe("onboarding recommendations", () => {
  it("recommends adult female self checkups", () => {
    assert.deepEqual(
      checkupSlugsFor({
        relationship: "SELF",
        birthDate: "1991-03-10",
        biologicalSex: "FEMALE",
      }).sort(),
      ["dentistry", "dermatology", "gynecology"].sort(),
    );
  });

  it("adds cardiology for adult male self with any risk factor", () => {
    assert.ok(
      checkupSlugsFor({
        relationship: "SELF",
        birthDate: "1991-03-10",
        biologicalSex: "MALE",
        healthInfo: {
          riskFactors: {
            hasFamilyHistory: true,
          },
        },
      }).includes("cardiology"),
    );
  });

  it("handles one child plus one parent recommendation matrix", () => {
    assert.deepEqual(
      checkupSlugsFor({
        relationship: "CHILD",
        birthDate: "2018-03-10",
        biologicalSex: "FEMALE",
      }).sort(),
      ["dentistry", "pediatrics"].sort(),
    );

    assert.ok(
      checkupSlugsFor({
        relationship: "PARENT",
        birthDate: "1960-03-10",
        biologicalSex: "MALE",
      }).includes("ophthalmology"),
    );
  });

  it("does not recommend gynecology for children", () => {
    assert.equal(
      checkupSlugsFor({
        relationship: "CHILD",
        birthDate: "2018-03-10",
        biologicalSex: "FEMALE",
      }).includes("gynecology"),
      false,
    );
  });

  it("adds ophthalmology for adults age 40+", () => {
    assert.ok(
      checkupSlugsFor({
        relationship: "SELF",
        birthDate: "1980-03-10",
        biologicalSex: "MALE",
      }).includes("ophthalmology"),
    );
  });

  it("keeps parent cardiology at the stronger default than younger adult self", () => {
    const parentCardiology = getRecommendedCheckupsForProfile(
      {
        relationship: "PARENT",
        birthDate: "1960-03-10",
        biologicalSex: "MALE",
      },
      today,
    ).find((checkup) => checkup.checkupTypeSlug === "cardiology");

    const youngerSelfCardiology = getRecommendedCheckupsForProfile(
      {
        relationship: "SELF",
        birthDate: "1991-03-10",
        biologicalSex: "MALE",
      },
      today,
    ).find((checkup) => checkup.checkupTypeSlug === "cardiology");

    assert.equal(parentCardiology?.frequencyDays, 180);
    assert.equal(youngerSelfCardiology, undefined);
  });
});

describe("onboarding queue helpers", () => {
  it("orders self first, then children, then parents", () => {
    assert.deepEqual(
      buildOnboardingQueue({
        includeSelf: true,
        childCount: 1,
        parentCount: 1,
      }).map((entry) => entry.relationship),
      ["SELF", "CHILD", "PARENT"],
    );
  });
});
