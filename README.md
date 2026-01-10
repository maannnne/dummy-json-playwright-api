# Playwright API Automation Framework

## 📦 Installation & Running Tests

- Clone the repository and do `npm install`
- After everything is installed, run `npx playwright test`
- There is only 1 project that contains all the tests, so all tests will run

---

## 📊 Viewing Test Results

- The report is generated in /playwright-report folder,
- As soon as you run the tests, the report will automatically open for your convenience

---

## 🧠 Design Decisions & Tradeoffs

_Framework Design:_  
The framework is written with Service Object Pattern (similar to POM, byt for API).
Products API logic is encapsulated in src/apis/products.api.ts.
All validations are encapsulated in src/validators/base.validator.ts as shared validations across all APIs. 
I used fixtures to create instances of ProductsAPI and BaseValidators and have them ready to use in tests by adding them to test fixtures
Custom DTOs are used for request and response typing (usually this comes from dev-generated libs, but I created myself for demo purposes).
All tests can be found in tests folder. 

_Test Data Generation and Creation_:  
Request bodies for products are created via a builder.
All test data (besides fixed ones like the category list) is generated via faker library.

_Parallelism_:
All 20 tests run in parallel with default worker count (4 at this point).

_Limitations_:
In DummyJson
Adding a new product will not add it into the server.
Updating a product will not update it into the server.
Deleting a product will not delete it into the server.
You will find related comments wherever I was limited to add more scenarios.




---

## ⚙️ Reliability & Parallel Execution

_Describe how the framework ensures reliable and parallel-safe execution._

- Test isolation strategy
- Data creation and cleanup approach
- Parallel execution support
- How flaky tests are avoided

---

## 📁 Project Structure (Optional)

_Optionally explain the folder structure and responsibilities of each layer._

---

## 🔮 Future Improvements (Optional)

_List possible enhancements or next steps for the framework._
