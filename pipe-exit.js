#!/usr/bin/env node

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
