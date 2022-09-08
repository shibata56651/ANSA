module.exports = {
    preset: 'jest-puppeteer',
    globals: {
      // スナップショットとの比較対象をデモにするならtrue、ローカルにするならfalse
        isCompareDemo: false,
        domain: {
        },
        windowSize: {
            pc: {
                width: 1920,
                height: 1080,
            },
            sp: {
                width: 375,
                height: 667,
            },
        },
    },
};
