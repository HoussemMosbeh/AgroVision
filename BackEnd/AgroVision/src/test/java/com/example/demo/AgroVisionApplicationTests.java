package com.example.demo;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class AgroVisionApplicationTests {

	@Test
	void applicationStarts() {
		// Simple test that verifies the application class can be instantiated
		assertDoesNotThrow(() -> {
			AgroVisionApplication app = new AgroVisionApplication();
		}, "Application should be instantiable");
	}

}
