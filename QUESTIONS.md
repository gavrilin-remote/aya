```
### Questions

Objective: demonstrate that the design desicions you made were solid by
answering the questions.

1. How to change the code to support different file versions?
2. How the import system will change if data on exchange rates disappears from
   the file, and it will need to be received asynchronously (via API)?
3. In the future the client may want to import files via the web interface,
   how can the system be modified to allow this?
```

1. Based on the difference between the file versions we can:
   * Create new `DumpParser` instance with custom configuration if delimiters or fields format was changed.
   * Modify `DumpParser` by adding new `parse` function if file contain breaking changes.
2. Next changes will be required:
   * remove parsing of exchange rates from `DumpParser`
   * modify `importExchangeRates` method in `DumpImporter` with code that will request exchange rates from remote API.
3. Next changes will be required:
   * remove selfcall from `DumpImporter` file
   * modify `run` function in `DumpImporter` to get dump string in arguments
   * create POST api endpoint to recieve dump file from web interface
   * create new instance of DumpImporter and run importer in request handler
