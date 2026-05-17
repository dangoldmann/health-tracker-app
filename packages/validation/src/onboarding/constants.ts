export const profileRelationshipValues = ["SELF", "PARENT", "CHILD"] as const;
export const biologicalSexValues = ["MALE", "FEMALE", "OTHER"] as const;

export const MAX_SELF_PROFILES = 1;
export const MAX_CHILD_PROFILES = 2;
export const MAX_PARENT_PROFILES = 2;

export const checkupTypeCatalog = [
  {
    slug: "cardiology",
    name: "Cardiology",
  },
  {
    slug: "dentistry",
    name: "Dentistry",
  },
  {
    slug: "dermatology",
    name: "Dermatology",
  },
  {
    slug: "gynecology",
    name: "Gynecology",
  },
  {
    slug: "ophthalmology",
    name: "Ophthalmology",
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
  },
] as const;
