export const longestSequence = <T = number>(array: T[], condition: (element: T, i: number) => boolean) => {
    let longestSequence = 0;
    let temp = 0;

    array.forEach((element, i) => {
        if (condition(element, i)) {
            temp++;
        } else {
            if (longestSequence < temp) {
                longestSequence = temp;
            }

            temp = 0;
        }

        if (i === array.length - 1) {
            if (longestSequence < temp) {
                longestSequence = temp;
            }
        }
    });

    return longestSequence;
};
