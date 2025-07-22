# pipe-exit

This script reads all data from its standard input (stdin).
If any data is received, it sends that data to standard output and exits with a status code of 1 (indicating failure).
If no data is received, it sends nothing to stdout and exits with a status code of 0 (indicating success).

* Exit Code 0: Success (no input received)
* Exit Code 1: Failure (input received and passed through)
* Exit Code 2: Internal error during stream processing

Usage:

```bash
your_command_expression 2>&1 | pipe-exit
```

## Examples

### Success - no output from 'true'

* `true 2>&1 | pipe-exit`
* Expected output: (nothing)
* Expected exit code: 0

### Failure - output from 'echo'

* `echo "Error message here" 2>&1 | pipe-exit`
* Expected output: "Error message here"
* Expected exit code: 1

### Failure - output from 'ls' in case of error

* `ls non_existent_file 2>&1 | pipe-exit`
* Expected output: (ls error message)
* Expected exit code: 1
