export default function recoveryMechanism() {
	// 1. is Job Processing
	// 2. is Attempt Waiting
	// 3. Identify provider + model and their recovery rules
	// 4. Is there a providerRequestId or is it null?
	// 5. Check relevant events
	// 6. Check current heartbeat + timing
	// 7. If providerRequestId is present - try and access their recovery mechanism if it's possible
	// 8. Combine all the evidence
	// 9. Make a decision based on the evidence: KEEP WAITING, RECONCILIATION, RETRY, FAIL
	// 10. Record the decision and why
}
