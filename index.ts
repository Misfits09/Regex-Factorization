const make_tree = (numbers: number[]) => {
  const tree: any = {};
  numbers.forEach((nb) => {
    nb.toString()
      .split("")
      .reduce((parentNode, digit, index) => {
        if (parentNode[digit] === undefined) {
          parentNode[digit] = {};
        }
        return parentNode[digit];
      }, tree);
  });
  return tree;
};

const make_regex = (numbers_tree: any) => {
  let regex = "";
  const makeLogic = (subtree: any) => {
    if (subtree === {}) return "";
    else {
      const keys = Object.keys(subtree).map((s) => parseInt(s));
      keys.sort((a, b) => a - b);
      return keys
        .map((n) => n.toString())
        .map((key) => {
          const subregex: string = makeLogic(subtree[key]);
          if (subregex.length === 0) return key;
          else if (!subregex.includes("|")) return `${key}${subregex}`;
          else return `${key}(${subregex})`;
        })
        .join("|");
    }
  };
  const notGroupedRegex = makeLogic(numbers_tree);
  return notGroupedRegex.replace(/\((\d\|)+\d\)/g, (match) => {
    const groups: number[][] = [];
    match
      .substring(1, match.length - 1)
      .split("|")
      .reduce((groupIndex, n) => {
        const nbr = parseInt(n);
        if (groupIndex === -1) {
          groups.push([nbr]);
          return groupIndex + 1;
        }

        if (groups[groupIndex].includes(nbr - 1)) {
          groups[groupIndex].push(nbr);
          return groupIndex;
        } else {
          groups.push([nbr]);
          return groupIndex + 1;
        }
      }, -1);
    return `(${groups
      .map((list) =>
        list.length === 1
          ? list[0].toString()
          : `[${list[0]}-${list[list.length - 1]}]`
      )
      .join("|")})`;
  });
};

/**
 * Creates a regex from an array of numbers
 */
export const regexFromNumberArray = (array: number[]) =>
  make_regex(make_tree(array));

/**
 * Replace any part of a regex containing ORs with just digits like [a-Z]hello(123|456|32) or a(3|5|6)
 *
 * WARNING The list of numbers must be contained in parenthesis or representing the entire string
 */
export const simplifyExistingRegex = (regex: string) =>
  regex
    .replace(/^((\d+|(\(\d+\)))\|?)+$/g, (match) => {
      return regexFromNumberArray(
        match
          .split("|")
          .map((s) => s.replace(/(^\()|(\)$)/g, ""))
          .map((s) => parseInt(s))
      );
    })
    .replace(/\(((\d+|(\(\d+\)))\|?)+\)/g, (match) => {
      match = match.substring(1, match.length - 1);
      const simplified = regexFromNumberArray(
        match
          .split("|")
          .map((s) => s.replace(/(^\()|(\)$)/g, ""))
          .map((s) => parseInt(s))
      );
      return `(${simplified})`;
    });
