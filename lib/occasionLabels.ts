/**
 * Display label per occasion_type. Templates carry two spellings of the
 * same occasion, a legacy run-together one and the hyphenated short_id
 * from the occasions table, so both map to one label and the page groups
 * them together rather than showing near-duplicate chips.
 */
export const OCCASION_LABELS: Record<string, string> = {
  apology: "Apology",
  appreciation: "Appreciation",
  "employee-appreciation": "Employee Appreciation",
  birthday: "Birthday",
  birthdays: "Birthday",
  celebration: "Celebration",
  christmas: "Christmas",
  congratulations: "Congratulations",
  farewell: "Farewell",
  fathersday: "Father's Day",
  "fathers-day": "Father's Day",
  getwellsoon: "Get Well Soon",
  "get-well-soon": "Get Well Soon",
  graduation: "Graduation",
  "all-holidays": "All Holidays",
  housewarming: "Housewarming",
  mothersday: "Mother's Day",
  "mothers-day": "Mother's Day",
  newbaby: "New Baby",
  "new-baby": "New Baby",
  newyear: "New Year",
  "new-year": "New Year",
  "office-competition": "Office Competition",
  promotion: "Promotion",
  "recruiting-onboarding": "Recruit & Onboard",
  retirement: "Retirement",
  sympathy: "Sympathy",
  teamcelebration: "Team Celebration",
  "team-celebration": "Team Celebration",
  thankyou: "Thank You",
  "thank-you": "Thank You",
  valentinesday: "Valentine's Day",
  "valentines-day": "Valentine's Day",
  wedding: "Wedding",
  weddings: "Wedding",
  welcome: "Welcome",
  workanniversary: "Work Anniversary",
  "work-anniversary": "Work Anniversary",
  "any-other": "Any Other",
};

export const formatOccasionLabel = (type: string) =>
  OCCASION_LABELS[type] ?? type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
