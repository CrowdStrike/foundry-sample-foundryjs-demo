![CrowdStrike Falcon](/images/cs-logo.png?raw=true)

# Foundryjs Demo sample Foundry app

The Foundryjs Demo sample Foundry app is a community-driven, open source project which serves as an example of an app which can be built using CrowdStrike's Foundry ecosystem. `foundry-sample-foundryjs-demo` is an open source project, not a CrowdStrike product. As such, it carries no formal support, expressed or implied.

This app is one of several App Templates included in Foundry that you can use to jumpstart your development. It comes complete with a set of preconfigured capabilities aligned to its business purpose. Deploy this app from the Templates page with a single click in the Foundry UI, or create an app from this template using the CLI.

> [!IMPORTANT]
> To view documentation and deploy this sample app, you need access to the Falcon console.

## Description

A comprehensive demonstration of the foundry-js JavaScript library (`@crowdstrike/foundry-js`) showcasing all major features and capabilities through an interactive web application. This demo provides working examples of core API features including FalconApi connection, event handling, workflow execution, collections CRUD operations, LogScale integration, API integrations, cloud functions, navigation utilities, modal management, and comprehensive error handling patterns.

## Prerequisites

* The Foundry CLI (instructions below).
* Node.js 18+ (needed if modifying the app's UI). See [Node.js](https://nodejs.org/) for installation instructions.
* Python 3.13+ (needed if modifying the app's functions). See [Python For Beginners](https://www.python.org/about/gettingstarted/) for installation instructions.

### Install the Foundry CLI

You can install the Foundry CLI with Scoop on Windows or Homebrew on Linux/macOS.

**Windows**:

Install [Scoop](https://scoop.sh/). Then, add the Foundry CLI bucket and install the Foundry CLI.

```shell
scoop bucket add foundry https://github.com/crowdstrike/scoop-foundry-cli.git
scoop install foundry
```

Or, you can download the [latest Windows zip file](https://assets.foundry.crowdstrike.com/cli/latest/foundry_Windows_x86_64.zip), expand it, and add the install directory to your PATH environment variable.

**Linux and macOS**:

Install [Homebrew](https://docs.brew.sh/Installation). Then, add the Foundry CLI repository to the list of formulae that Homebrew uses and install the CLI:

```shell
brew tap crowdstrike/foundry-cli
brew install crowdstrike/foundry-cli/foundry
```

Run `foundry version` to verify it's installed correctly.

## Getting Started

Clone this sample to your local system, or [download as a zip file](https://github.com/CrowdStrike/foundry-sample-foundryjs-demo/archive/refs/heads/main.zip) and import it into Foundry.

```shell
git clone https://github.com/CrowdStrike/foundry-sample-foundryjs-demo
cd foundry-sample-foundryjs-demo
```

Log in to Foundry:

```shell
foundry login
```

Select the following permissions:

- [x] Create and run RTR scripts
- [x] Create, execute and test workflow templates
- [x] Create, run and view API integrations
- [x] Create, edit, delete, and list queries

Deploy the app:

```shell
foundry apps deploy
```

> [!TIP]
> If you get an error that the name already exists, change the name to something unique to your CID in `manifest.yml`.

Once the deployment has finished, you can release the app:

```shell
foundry apps release
```

Next, go to **Foundry** > **App catalog**, find your app, and install it. Navigate to **Foundry** > **Apps** in your Falcon Console, find "Foundryjs Demo" in your app list, and click to open the interactive demonstration.

## About this sample app

The **Foundryjs Demo** is a comprehensive reference implementation showcasing the full capabilities of the foundry-js JavaScript library. This sample application serves as both a learning resource and a practical starting point for developers building Foundry applications.

### Key Components

- **Interactive UI Pages**: Built with React 19, React Router 7, and Tailwind CSS, featuring the official foundry-js JavaScript library
- **Python Cloud Function**: A simple greeting function that demonstrates basic serverless capabilities with workflow integration
- **API Integrations**: JSONPlaceholder API for testing external service integration
- **Collections**: Demo collection for showcasing CRUD operations with structured data
- **LogScale Queries**: Saved searches demonstrating user activity monitoring
- **Workflows**: Simple greeting workflow template for automation examples

### Features Demonstrated

**Core API Features:**
- **FalconApi Connection**: Initialize and establish connection to Falcon console
- **Event Handling**: Receive and process context data from Falcon console
- **Workflow Execution**: Execute on-demand workflows and retrieve results
- **Collections CRUD**: Complete Create, Read, Update, Delete operations on Foundry collections
- **LogScale Integration**: Write events, execute dynamic queries, and run saved searches

**Advanced Features:**
- **API Integrations**: Call external APIs through configured OpenAPI specifications
- **Cloud Functions**: Execute Foundry serverless functions with various HTTP methods
- **Navigation Utilities**: Handle internal hash-based routing and external navigation
- **Modal Management**: Open and close modals within the Falcon console
- **Error Handling**: Comprehensive error handling patterns and user feedback

### Educational Value

Each feature demonstration includes:
- **Interactive Forms**: Input fields to test different parameters
- **Example Buttons**: Pre-filled examples for quick testing
- **Real-time Results**: Live display of API responses
- **Error Handling**: Clear error messages and debugging information
- **Code Examples**: Comprehensive documentation through working code

### Target Audience

This demo is designed for:
- Developers new to the Foundry platform
- Teams building custom Foundry applications
- Security engineers exploring Foundry automation capabilities
- Anyone seeking comprehensive SDK documentation through code examples

## Foundry resources

- Foundry documentation: [US-1](https://falcon.crowdstrike.com/documentation/category/c3d64B8e/falcon-foundry) | [US-2](https://falcon.us-2.crowdstrike.com/documentation/category/c3d64B8e/falcon-foundry) | [EU](https://falcon.eu-1.crowdstrike.com/documentation/category/c3d64B8e/falcon-foundry)
- Foundry learning resources: [US-1](https://falcon.crowdstrike.com/foundry/learn) | [US-2](https://falcon.us-2.crowdstrike.com/foundry/learn) | [EU](https://falcon.eu-1.crowdstrike.com/foundry/learn)

---

<p align="center"><img src="/images/cs-logo-footer.png"><br/><img width="300px" src="/images/adversary-goblin-panda.png"></p>
<h3><p align="center">WE STOP BREACHES</p></h3>