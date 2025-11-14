export const Direction = {
  Regular: false,
  Reverse: true
};

export const TlxContents = {
  'MentalDemand': Direction.Reverse,
  'PhysicalDemand': Direction.Reverse,
  'TemporalDemand': Direction.Reverse,
  'Performance': Direction.Regular,
  'Effort': Direction.Reverse,
  'Frustration': Direction.Reverse
};

export const TlxExtremes = {
  [Direction.Reverse]: {
    l: 'veryLow',
    r: 'veryHigh'
  },
  [Direction.Regular]: {
    l: 'failure',
    r: 'perfect'
  }
};

export const PresenceContents = {
  'ForgetProblems': Direction.Regular,
  'AnotherWorld': Direction.Regular,
  'ForgetAround': Direction.Regular,
  'Experience': Direction.Regular
};

export const AltTypes = {
  Presence: 'presence'
}
