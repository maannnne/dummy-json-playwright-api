import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

export const testResultStatus = {
    passed: '✅',
    failed: '❌',
    skipped: '⏩',
    interrupted: '👀',
    timedOut: '⏱️',
};

class DummyReporter implements Reporter {
    onBegin(config: FullConfig, suite: Suite) {
        console.log(`🚀 Starting test run. Total test count: ${suite.allTests().length}`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        console.log(`${testResultStatus[result.status]} ${result.status}: ${test.title}: `);
    }

    onEnd(result: FullResult) {
        console.log(`🏁 Finished the run: ${result.status}`);
    }
}

export default DummyReporter;
