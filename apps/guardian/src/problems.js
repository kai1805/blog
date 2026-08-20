// Curated Hard problems that mirror the patterns most common in LeetCode
// contest Q3/Q4 slots - the actual lever for the Guardian badge (top 5%
// of contest rating, roughly 2200+), since Guardian is rating-based, not
// a solve-count badge.
export const CATEGORIES = [
  {
    name: "Dynamic Programming",
    problems: [
      { id: 312, title: "Burst Balloons", slug: "burst-balloons" },
      { id: 44, title: "Wildcard Matching", slug: "wildcard-matching" },
      { id: 10, title: "Regular Expression Matching", slug: "regular-expression-matching" },
      { id: 887, title: "Super Egg Drop", slug: "super-egg-drop" },
      { id: 1235, title: "Maximum Profit in Job Scheduling", slug: "maximum-profit-in-job-scheduling" },
      { id: 1187, title: "Make Array Strictly Increasing", slug: "make-array-strictly-increasing" },
      { id: 1655, title: "Distribute Repeating Integers", slug: "distribute-repeating-integers" },
      { id: 1994, title: "The Number of Good Subsets", slug: "the-number-of-good-subsets" },
    ],
  },
  {
    name: "Graphs",
    problems: [
      { id: 787, title: "Cheapest Flights Within K Stops", slug: "cheapest-flights-within-k-stops" },
      {
        id: 1489,
        title: "Find Critical and Pseudo-Critical Edges in MST",
        slug: "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree",
      },
      { id: 1976, title: "Number of Ways to Arrive at Destination", slug: "number-of-ways-to-arrive-at-destination" },
      {
        id: 1697,
        title: "Checking Existence of Edge Length Limited Paths",
        slug: "checking-existence-of-edge-length-limited-paths",
      },
      { id: 2065, title: "Maximum Path Quality of a Graph", slug: "maximum-path-quality-of-a-graph" },
    ],
  },
  {
    name: "Segment Tree / BIT",
    problems: [
      { id: 315, title: "Count of Smaller Numbers After Self", slug: "count-of-smaller-numbers-after-self" },
      { id: 327, title: "Count of Range Sum", slug: "count-of-range-sum" },
      {
        id: 2035,
        title: "Partition Array Into Two Arrays to Minimize Sum Difference",
        slug: "partition-array-into-two-arrays-to-minimize-sum-difference",
      },
      { id: 1649, title: "Create Sorted Array through Instructions", slug: "create-sorted-array-through-instructions" },
    ],
  },
  {
    name: "Monotonic Stack / Queue",
    problems: [
      { id: 42, title: "Trapping Rain Water", slug: "trapping-rain-water" },
      { id: 84, title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram" },
      { id: 862, title: "Shortest Subarray with Sum at Least K", slug: "shortest-subarray-with-sum-at-least-k" },
      { id: 1425, title: "Constrained Subsequence Sum", slug: "constrained-subsequence-sum" },
    ],
  },
  {
    name: "Binary Search on Answer",
    problems: [
      { id: 410, title: "Split Array Largest Sum", slug: "split-array-largest-sum" },
      { id: 1552, title: "Magnetic Force Between Two Balls", slug: "magnetic-force-between-two-balls" },
      { id: 1231, title: "Divide Chocolate", slug: "divide-chocolate" },
    ],
  },
  {
    name: "Union-Find",
    problems: [
      { id: 1102, title: "Path With Maximum Minimum Value", slug: "path-with-maximum-minimum-value" },
      { id: 2172, title: "Maximum AND Sum of Array", slug: "maximum-and-sum-of-array" },
    ],
  },
  {
    name: "String Algorithms",
    problems: [
      { id: 214, title: "Shortest Palindrome", slug: "shortest-palindrome" },
      { id: 1163, title: "Last Substring in Lexicographical Order", slug: "last-substring-in-lexicographical-order" },
      { id: 1044, title: "Longest Duplicate Substring", slug: "longest-duplicate-substring" },
    ],
  },
  {
    name: "Math / Bit Tricks",
    problems: [
      { id: 1808, title: "Maximize Number of Nice Divisors", slug: "maximize-number-of-nice-divisors" },
      {
        id: 1521,
        title: "Find a Value of a Mysterious Function Closest to Target",
        slug: "find-a-value-of-a-mysterious-function-closest-to-target",
      },
      { id: 2135, title: "Count Words Obtained After Adding a Letter", slug: "count-words-obtained-after-adding-a-letter" },
    ],
  },
  {
    name: "Greedy + Heap",
    problems: [
      { id: 630, title: "Course Schedule III", slug: "course-schedule-iii" },
      {
        id: 1953,
        title: "Maximum Number of Weeks for Which You Can Work",
        slug: "maximum-number-of-weeks-for-which-you-can-work",
      },
      { id: 2402, title: "Meeting Rooms III", slug: "meeting-rooms-iii" },
    ],
  },
];
