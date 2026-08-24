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
      { id: 140, title: "Word Break II", slug: "word-break-ii" },
      { id: 691, title: "Stickers to Spell Word", slug: "stickers-to-spell-word" },
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
      {
        id: 1368,
        title: "Minimum Cost to Make at Least One Valid Path in a Grid",
        slug: "minimum-cost-to-make-at-least-one-valid-path-in-a-grid",
      },
      { id: 882, title: "Reachable Nodes In Subdivided Graph", slug: "reachable-nodes-in-subdivided-graph" },
      { id: 815, title: "Bus Routes", slug: "bus-routes" },
      { id: 778, title: "Swim in Rising Water", slug: "swim-in-rising-water" },
      { id: 847, title: "Shortest Path Visiting All Nodes", slug: "shortest-path-visiting-all-nodes" },
      { id: 126, title: "Word Ladder II", slug: "word-ladder-ii" },
      { id: 773, title: "Sliding Puzzle", slug: "sliding-puzzle" },
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
      { id: 493, title: "Reverse Pairs", slug: "reverse-pairs" },
      { id: 699, title: "Falling Squares", slug: "falling-squares" },
      { id: 2179, title: "Count Good Triplets in an Array", slug: "count-good-triplets-in-an-array" },
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
      { id: 4, title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays" },
      {
        id: 632,
        title: "Smallest Range Covering Elements from K Lists",
        slug: "smallest-range-covering-elements-from-k-lists",
      },
    ],
  },
  {
    name: "Union-Find",
    problems: [
      { id: 1102, title: "Path With Maximum Minimum Value", slug: "path-with-maximum-minimum-value" },
      { id: 2172, title: "Maximum AND Sum of Array", slug: "maximum-and-sum-of-array" },
      { id: 924, title: "Minimize Malware Spread", slug: "minimize-malware-spread" },
      { id: 803, title: "Bricks Falling When Hit", slug: "bricks-falling-when-hit" },
      { id: 827, title: "Making A Large Island", slug: "making-a-large-island" },
      { id: 685, title: "Redundant Connection II", slug: "redundant-connection-ii" },
    ],
  },
  {
    name: "String Algorithms",
    problems: [
      { id: 214, title: "Shortest Palindrome", slug: "shortest-palindrome" },
      { id: 1163, title: "Last Substring in Lexicographical Order", slug: "last-substring-in-lexicographical-order" },
      { id: 1044, title: "Longest Duplicate Substring", slug: "longest-duplicate-substring" },
      { id: 224, title: "Basic Calculator", slug: "basic-calculator" },
      { id: 68, title: "Text Justification", slug: "text-justification" },
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
      { id: 41, title: "First Missing Positive", slug: "first-missing-positive" },
      { id: 1755, title: "Closest Subsequence Sum", slug: "closest-subsequence-sum" },
      { id: 943, title: "Find the Shortest Superstring", slug: "find-the-shortest-superstring" },
      { id: 149, title: "Max Points on a Line", slug: "max-points-on-a-line" },
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
      { id: 135, title: "Candy", slug: "candy" },
      { id: 502, title: "IPO", slug: "ipo" },
    ],
  },
  {
    name: "Sliding Window / Substring",
    problems: [
      { id: 76, title: "Minimum Window Substring", slug: "minimum-window-substring" },
      { id: 2444, title: "Count Subarrays With Fixed Bounds", slug: "count-subarrays-with-fixed-bounds" },
      { id: 239, title: "Sliding Window Maximum", slug: "sliding-window-maximum" },
      {
        id: 30,
        title: "Substring with Concatenation of All Words",
        slug: "substring-with-concatenation-of-all-words",
      },
    ],
  },
  {
    name: "Trie & String Matching",
    problems: [
      { id: 336, title: "Palindrome Pairs", slug: "palindrome-pairs" },
      { id: 2416, title: "Sum of Prefix Scores of Strings", slug: "sum-of-prefix-scores-of-strings" },
      { id: 212, title: "Word Search II", slug: "word-search-ii" },
      { id: 472, title: "Concatenated Words", slug: "concatenated-words" },
      { id: 1938, title: "Maximum Genetic Difference Query", slug: "maximum-genetic-difference-query" },
    ],
  },
  {
    name: "Design & Data Structures",
    problems: [
      { id: 2276, title: "Design Movie Rental System", slug: "design-movie-rental-system" },
      { id: 2296, title: "Design a Text Editor", slug: "design-a-text-editor" },
      {
        id: 2642,
        title: "Design Graph With Shortest Path Calculator",
        slug: "design-graph-with-shortest-path-calculator",
      },
      { id: 460, title: "LFU Cache", slug: "lfu-cache" },
      { id: 297, title: "Serialize and Deserialize Binary Tree", slug: "serialize-and-deserialize-binary-tree" },
      { id: 895, title: "Maximum Frequency Stack", slug: "maximum-frequency-stack" },
    ],
  },
  {
    name: "Line Sweep / Intervals",
    problems: [
      { id: 1851, title: "Minimum Interval to Include Each Query", slug: "minimum-interval-to-include-each-query" },
      { id: 218, title: "The Skyline Problem", slug: "the-skyline-problem" },
      { id: 2251, title: "Number of Flowers in Full Bloom", slug: "number-of-flowers-in-full-bloom" },
      {
        id: 2163,
        title: "Minimum Difference in Sums After Removal of Elements",
        slug: "minimum-difference-in-sums-after-removal-of-elements",
      },
      { id: 732, title: "My Calendar III", slug: "my-calendar-iii" },
    ],
  },
  {
    name: "Topological Sort",
    problems: [
      { id: 2050, title: "Parallel Courses III", slug: "parallel-courses-iii" },
      { id: 2392, title: "Build a Matrix With Conditions", slug: "build-a-matrix-with-conditions" },
    ],
  },
  {
    name: "Euler Circuit / Graph Construction",
    problems: [
      { id: 332, title: "Reconstruct Itinerary", slug: "reconstruct-itinerary" },
      { id: 753, title: "Cracking the Safe", slug: "cracking-the-safe" },
      { id: 2097, title: "Valid Arrangement of Pairs", slug: "valid-arrangement-of-pairs" },
    ],
  },
  {
    name: "LIS / Sequences",
    problems: [
      {
        id: 1671,
        title: "Minimum Number of Removals to Make Mountain Array",
        slug: "minimum-number-of-removals-to-make-mountain-array",
      },
      {
        id: 1964,
        title: "Find the Longest Valid Obstacle Course at Each Position",
        slug: "find-the-longest-valid-obstacle-course-at-each-position",
      },
      { id: 354, title: "Russian Doll Envelopes", slug: "russian-doll-envelopes" },
    ],
  },
  {
    name: "Rolling Hash & Palindromes",
    problems: [
      { id: 2156, title: "Find Substring With Given Hash Value", slug: "find-substring-with-given-hash-value" },
      { id: 1923, title: "Longest Common Subpath", slug: "longest-common-subpath" },
      {
        id: 1960,
        title: "Maximum Product of the Length of Two Palindromic Substrings",
        slug: "maximum-product-of-the-length-of-two-palindromic-substrings",
      },
    ],
  },
  {
    name: "Matrix / Grid",
    problems: [
      { id: 1074, title: "Number of Submatrices That Sum to Target", slug: "number-of-submatrices-that-sum-to-target" },
      { id: 85, title: "Maximal Rectangle", slug: "maximal-rectangle" },
    ],
  },
  {
    name: "Backtracking & DFS",
    problems: [
      {
        id: 987,
        title: "Vertical Order Traversal of a Binary Tree",
        slug: "vertical-order-traversal-of-a-binary-tree",
      },
      {
        id: 2246,
        title: "Longest Path With Different Adjacent Characters",
        slug: "longest-path-with-different-adjacent-characters",
      },
      { id: 2440, title: "Create Components With Same Value", slug: "create-components-with-same-value" },
      { id: 51, title: "N-Queens", slug: "n-queens" },
    ],
  },
  {
    name: "Linked List",
    problems: [
      { id: 25, title: "Reverse Nodes in k-Group", slug: "reverse-nodes-in-k-group" },
      { id: 23, title: "Merge k Sorted Lists", slug: "merge-k-sorted-lists" },
    ],
  },
];
