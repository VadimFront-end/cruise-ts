export const solutionSystem = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number[] => {
    const system = [
        [y1, x1 * x1, x1, 1],
        [y2, x2 * x2, x2, 1],
        [y3, x3 * x3, x3, 1]
    ];
    for (let i = 0; i < 4; i++) {
        system[1][i] = system[1][i] - system[0][i];
        system[2][i] = system[2][i] - system[0][i];
    }
    const factor = system[1][2] / system[2][2];
    for (let i = 0; i < 3; i++) {
        system[1][i] = system[1][i] - (system[2][i]) * factor;
    }
    const a = system[1][0] / system[1][1];
    const b = (system[2][0] - a * (system[2][1])) / system[2][2];
    const c = system[0][0] - a * (system[0][1]) - b * (system[0][2]);
    return [a, b, c];
};
