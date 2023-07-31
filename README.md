# Clinical Application Project (CAP)

Welcome to CAP! This repository includes a server and client application suite designed to revolutionize the evaluation of clinical data resources. The server, built on top of the open-source [Hapi-FHIR](https://hapifhir.io/) project, features [Auth0](https://auth0.com/) bearer token authentication to secure your data.

## Project Overview

The CAP project emerged from an academic initiative that set out to create a healthcare application for managing patient data and related observations. The objectives were manifold, ranging from expanding our software development knowledge base to understanding Fast Healthcare Interoperability Resources (FHIR) use. Our end goal was to design an application capable of enhancing patient management processes to address specific use-cases within the healthcare domain. This project gave us valuable insights into software project management and allowed us to apply theoretical knowledge to practical use-cases in the critical field of healthcare.

## Contents

- [Project Scope](#project-scope)
- [Frontend Integration](#frontend-integration)
- [Client - PatientGenerator](#client---patientgenerator)
- [Server Configuration](#server-configuration)
- [Installation and Setup](#installation-and-setup)
- [Usage Instructions](#usage-instructions)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Project Scope

In the realm of clinical applications, having a robust and user-friendly environment for testing various resources is indispensable. Our project aims to provide an effective solution for server testing with clinical data resources. The server, powered by Hapi-FHIR, offers multiple RESTful endpoints, augmented with bearer token authentication for improved security.

## Frontend Integration

Our server repository seamlessly meshes with the frontend component of the project. Together, they create a comprehensive solution for clinical application testing, offering an intuitive interface to interact with clinical data resources.

Explore the [FrontEnd](https://github.com/GravityDarkLab/Clinical-Application-Project/tree/main/Front-end) to unlock the full potential of CAP. The frontend enhances the user experience and extends the server's functionality.

## Client - PatientGenerator

The `PatientGenerator-client` is a mock client application devised to create random patient data and engage with the server via HTTP requests. This setup enables users to simulate real-world scenarios and evaluate the server's handling of different resources.

## Server Configuration

Our `server` directory, based on Hapi-FHIR, serves as the core component of the project. Customized to meet our application's unique requirements, we've added bearer token authentication to secure the server and protect sensitive patient data.

## Installation and Setup

1. **Install Node.js:**
   Ensure Node.js is installed on your machine before installing npm (comes bundled with Node.js). If not, you can download and install it from the official [Node.js website](https://nodejs.org/).

2. **Confirm Installation:**
   Post-installation, verify if npm is installed by running the following commands in your terminal/command prompt:
   ```
   node -v
   npm -v
   ```
   These commands will return the installed versions of Node.js and npm.

To kickstart with CAP, follow these steps:

1. **Clone the Repository:** Clone this repository onto your local machine with:
   ```
   git clone https://github.com/GravityDarkLab/Clinical-Application-Project.git
   ```

2. **Server Configuration:** download the prebuilt server [here](https://drive.google.com/drive/folders/1pery1-VEiU5qInV35zOIW4Vb3jjmPfdU?usp=drive_link) and follow the instructions in the Readme.

3. **Optional: Download the Server:** Optionally, navigate to the `server` directory and follow the provided instructions for server setup. Make sure you've installed all necessary dependencies.

4. **Build the PatientGenerator:** Navigate to the `PatientGenerator-client` directory, update the configurations (if needed) to match your server's endpoint, build the client application, and start testing the server's response to different resources and HTTP methods.

5. **Frontend Setup:** Navigate to the frontend directory and install the required dependencies with npm:
   ```
   npm install
   ```

6. **Launch Development Server:** Start the development server with:
   ```
   npm start
   ```
   Access the app at http://localhost:3000 in your web browser.

## Usage Instructions

The preceding steps help set up both the backend server and frontend application, enabling smooth interaction with the clinical data resources. If you encounter any issues or need assistance, don't hesitate to contact us.
To login and test we provide you with this fake admin: `dummy@gmail` and password: `Test1Test1`. 

## Acknowledgments

We extend our heartfelt gratitude to the [Hapi-FHIR](https://github.com/hapifhir/hapi-fhir-jpaserver-starter) community for providing the fundamental server component for CAP. Their dedication to open-source healthcare solutions has been instrumental in fostering healthcare interoperability.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

CAP is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code in line with the license terms.

---

Thanks for your interest in CAP. We hope this project serves as a valuable resource in your clinical application testing journey. For further assistance or inquiries, please reach out to us. Happy testing!
