#!/usr/bin/env node

/**
 * This script reads all data from its standard input (stdin).
 * If any data is received, it prints that data to its standard output (stdout)
 * and exits with a status code of 1 (indicating failure).
 * If no data is received, it prints nothing to stdout and exits with a
 * status code of 0 (indicating success).
 *
 * Exit Code 0: Success (no input received)
 * Exit Code 1: Failure (input received and passed through)
 * Exit Code 2: Internal error during stream processing
 *
 * Usage:
 * your_command_expression 2>&1 | pipe-exit.js
 *
 * Example (Success - no output from 'true'):
 * true 2>&1 | node pipe-checker-cli.js
 * # Expected output: (nothing)
 * # Expected exit code: 0
 *
 * Example (Failure - output from 'echo'):
 * echo "Error message here" 2>&1 | pipe-exit.js
 * # Expected output: "Error message here"
 * # Expected exit code: 1
 *
 * Example (Failure - output from 'ls' in case of error):
 * ls non_existent_file 2>&1 | pipe-exit.js
 * # Expected output: (ls error message)
 * # Expected exit code: 1
 */

// Use a buffer to store all incoming data from stdin
const inputBuffer = []
let totalLength = 0
let ended = false // Flag to prevent multiple resolutions/rejections

// Listen for 'data' events from stdin
process.stdin.on("data", (chunk) => {
  inputBuffer.push(chunk)
  totalLength += chunk.length
  // Pass the data directly to the output stream as it arrives
  process.stdout.write(chunk)
})

// Listen for the 'end' event, which signifies that all input has been received
process.stdin.on("end", () => {
  if (!ended) {
    ended = true
    if (totalLength > 0) {
      // Input was received, exit with a failure code (1)
      // Data has already been written to stdout by the 'data' listener
      process.exit(1)
    } else {
      // No input was received, exit with a success code (0)
      process.exit(0)
    }
  }
})

// Listen for 'error' events on stdin (e.g., if the pipe breaks unexpectedly)
process.stdin.on("error", (err) => {
  if (!ended) {
    ended = true
    console.error("An unexpected error occurred while reading from stdin:", err.message)
    process.exit(2) // Exit with a different error code for stdin errors
  }
})

// Ensure the process doesn't exit prematurely if stdin is closed immediately
// For example, if piping from a command that produces no output and closes quickly.
// This ensures the 'end' event is properly triggered even for empty pipes.
process.stdin.resume()
