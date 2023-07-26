# Klinisches Anwendungsprojekt

Welcome to the Klinisches Anwendungsprojekt (Clinical Application Project) server repository! This project comprises a server and a client application designed to streamline the testing of clinical data resources. The server is built upon the open-source [Hapi-FHIR](https://hapifhir.io/) project and incorporates bearer token authentication for enhanced security.

## Table of Contents

- [Introduction](#introduction)
- [Frontend Integration](frontend-integration)
- [Client - PatientGenerator](#client---patientgenerator)
- [Server Configuration](#server-configuration)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Acknowledgment](#acknowledgment)
- [License](#license)

## Introduction

In the context of clinical applications, it is crucial to have a reliable and easy-to-use environment for testing different resources. This project aims to provide a practical solution for testing a server with clinical data resources. The server, based on Hapi-FHIR, offers various RESTful endpoints, and we have added bearer token authentication to enhance security.

## Frontend Integration

This server repository is designed to seamlessly integrate with the frontend component of the project. Together, they offer a comprehensive solution for clinical application testing, providing a user-friendly interface to interact with the clinical data resources.

We invite you to explore the [FrontEnd](https://github.com/GravityDarkLab/Clinical-Application-Project/tree/main/Front-end) to leverage the full potential of the Klinisches Anwendungsprojekt. The frontend enhances the overall user experience and complements the functionality of the server.

## Client - PatientGenerator

The `PatientGenerator-client` is a mock client application designed to generate random patient data and interact with the server through HTTP requests. This allows users to simulate real-world scenarios and test the server's handling of different resources. The client is a valuable tool for validating the server's functionality and performance.

## Server Configuration

The `server` directory contains the Hapi-FHIR-based server, which serves as the core component of this project. We have customized the server to suit the specific requirements of our clinical application. Bearer token authentication has been integrated to secure the server and control access to sensitive patient data.

## Getting Started

To get started with the Klinisches Anwendungsprojekt, follow these steps:

1. **Clone the Repository:** Begin by cloning this repository to your local machine.

2. **Configure the Server:** Navigate to the `server` directory and follow the provided instructions to set up and configure the server. Ensure that you have all the required dependencies installed.

3. Alternatively, you can download the built and ready-to-use server directly from [here](https://drive.google.com/drive/folders/1pery1-VEiU5qInV35zOIW4Vb3jjmPfdU?usp=drive_link) and follow the instructions in the Readme.

4. **Build the PatientGenerator:** Next, go to the `PatientGenerator-client` directory. If needed, update the configurations to match your server's endpoint. Then, build the client application and you can now start testing the server's response to various resources and HTTP methods.

5. **Prepare the Frontend:** Navigate to the front-end directory and install the required dependencies using npm:
   ```
   npm install
   ```

7. **Run the Development Server:** Start the development server by running the following command:
   ```
   npm start
   ```
   The app will be accessible at http://localhost:3000 in your web browser.

## Usage

By following these steps, you will have both the backend server and the frontend application up and running, enabling seamless interaction with the clinical data resources. Should you have any questions or need assistance, feel free to reach out. Happy testing!

## Acknowledgment

Special thanks to the [Hapi-FHIR](https://github.com/hapifhir/hapi-fhir-jpaserver-starter) community for providing the core server component that forms the foundation of our Klinisches Anwendungsprojekt. Their dedication to open-source excellence has been instrumental in advancing healthcare interoperability. We are grateful for their exceptional work and contributions.

## License

The Klinisches Anwendungsprojekt is distributed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code as per the terms of the license.

---

Thank you for your interest in the Klinisches Anwendungsprojekt. We hope this project proves to be a valuable asset in your clinical application testing endeavors. If you have any questions or need further assistance, please don't hesitate to reach out to us. Happy testing!
