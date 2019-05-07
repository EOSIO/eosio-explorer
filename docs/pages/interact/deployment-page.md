[Home](../..) > Smart Contract Deployment Page

# Smart Contract Deployment Page

Smart contract deployment can be performed in this page. The general flow for smart contract deployment is as follows:
1. Select the file which will be used as the entry point for deployment. This will be used as the file argument for `eosio-cpp`.
2. Specify the absolute path of the folder containing the file in step 1. This is required for file access.
3. Optionally, verify the compiled ABI by clicking "Generate ABI", or import a prepared ABI file beforehand with "Import ABI"
4. Click the "Deploy" button after specifying the account which should deploy this contract.
5. Any warnings or errors will be displayed in the ABI / Deployment Log section.

In order to compile smart contracts into the necessary `.abi` and `.wasm` files, a Node.JS service which makes use of a Docker container that will perform `eosio-cpp` compilation is started simultaneously with the web application. In order for the Docker container to correctly get the file and its dependencies, the service must mount the correct files into the container.

For security reasons, browsers cannot directly access the local filesystem. Therefore, it is up to you to provide the root folder path containing your entry `.cpp` file as well as any dependencies in the same level of this file. The root folder path will be saved in the local state of the tool for future sessions. 

:warning: Disclaimer :warning: - For compilation of the smart contract to work, you must start this tool locally, such as running the tool with `eosio-explorer init` or `eosio-explorer start_gui`. 

## Step 1 - Select File Entry Point

In this panel you can view the instructions necessary to compile or deploy your smart contract. It is also here that you supply the following:
1. The entry point file in `.cpp` file format
2. The absolute root folder path containing the file in #1.

You can drag and drop your file into the grey dropzone or click "Browse" to get your entry point file. In the field labeled "Root Folder Path," you type the full folder path in absolute format where it will persist for future development sessions. An example of a root folder path would be `/Users/syzygy/contracts/mycontract`. In this example, all files in the `/Users/syzygy/contracts/mycontract/` folder will be used for compilation. It is also assumed that the entry point file is also in this folder. 

## Step 2 - ABI File (Optional)

In this panel, there are two buttons available and a code viewer which should be empty.

### Generate ABI

After supplying the file and folder names in step 1, you can click "Generate ABI" to automatically compile the `.abi` file and display it in the empty code viewer. If it is successful, you will see the generated `.abi` file in the code viewer as well as any warnings in the ABI / Deployment Log section. If something went wrong, you can also check that section for any errors or problems that occurred during the compilation.

### Import ABI

Sometimes, generation of the `.abi` file fails. In these situations you may want to import your own pre-made `.abi` file, which you can do by clicking "Import ABI." After specifying the file, the `.abi` file will be visible in the code viewer and a small pill badge labeled "Imported ABI" will display next to the Step 3 label, indicating that you will be deploying your contract with an imported ABI file. 

## Step 3 - Deploy

In this panel you can select the account which should deploy this smart contract by clicking the "Deploy" button. Note that you cannot deploy any smart contract with the `eosio` account, since for local development, this `eosio` account currently has the EOSIO System Contract, which is crucial for many actions in the blockchain, including the creation of new accounts. The system will notify you that you cannot deploy under `eosio` if you try. 

The deployment process is as follows:

1. The file as specified in Step 1 will be passed to the compiler
2. In Step 2, if the user has imported their own pre-made ABI file, the compiler will use this ABI file for contract deployment. Otherwise, it will generate the ABI file by itself and attempt to deploy the contract.
3. After the ABI and WASM files are available, the local service will deploy the contract to the connected blockchain by using the `setcode` and `setabi` actions with the `eosio` contract. 
4. Result of the deployment will be available in the ABI / Deployment Log section.

## ABI / Deployment Log

Next to the ABI File and Deploy panels is a section containing logs about `.abi` generation and deployment. Errors and warnings are categorized into the following tabs:
1. Warnings - plain warnings such as actions missing ricardian clauses
2. Compiler errors - unexpected errors that are likely to come from the Docker container
3. Service errors - unexpected errors that are likely to come from the service, such as folders not being accessible

Under the **Deployment Result** section, upon a successful deployment, you will see the trimmed transaction object of the contract being successfully deployed. 

You can clear these logs by clicking the "CLEAR ALL LOGS" button which is in the upper right hand corner of this particular section.
