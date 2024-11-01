# SupplyTrust - Verifiable Supply Chain Data Management Systems for Tracing, Tracking, and Trusting Supply Chains

## Run SupplyTrust web app locally
1. Set up:
    - run `npm install` in terminal while being in root folder to download packages for backend
    - run `cd frontend` and run `npm install` again to download packages for frontend
    - go back to root folder by running `cd ..`
    - add `.env` files...
        - in folder `backend` and add the following env variables:
            - ``CHEQD_CREDENTIAL_SERVICE_TOKEN`` (get it [here]())
            - ``PINATA_API_JWT`` (get it following this [guide]())
            - ``PINATA_API_GATEWAY`` (get it following this [guide]())
            - ``BASE_URL``="http://localhost:3001"
        - in folder `frontend` and add the following env variables:
            - ``DANGEROUSLY_DISABLE_HOST_CHECK``=true
    **Note**: ensure that `package.json` in folder frontend contains `proxy=http://localhost:3001` as JSON attribute
2. Start running SupplyTrust web app on localhost:
    - run `npm start` in terminal while in root folder (this command automatically starts the backend and frontend)
3. Test SupplyTrust's tracing and tracking by entering ``did:cheqd:testnet:eb41cc0f-b773-440e-b675-0e4310368a52`` in [tracing and tracking form](http://localhost:3000/trace-and-track)

## Limitations
1. If one file was uploaded to the public ipfs and than uploaded to the private ipfs, SupplyTrust cannot gurantee privacy even when the file is unpinned from the public ipfs.

## What is _SupplyTrust_?

## What inspired me to create _SupplyTrust_?
Lack of accountability of supply chain entities gives them the opportunity to violate environment, human rights, and laws. How can non-malicious supply chain entities differentiate themselves from malicious ones. SupplyTrust provides the crucial technical infrastructure to track and trace supply chains in a trustworthy manner so that malicious supply chains are under pressure to reveal their supply chain history as well, otherwise customers become suspicious and go to non-malicious ones. In addition, consumers at the end of supply chains are left in the dark about their purchased products' history. How can consumers ensure that their diets or morals are not violated. Similarily, regulators have a hard time to audit supply chain entites, enforcing supply chain entities to use SupplyTrust allows regulators to perform their duties of ensuring the compliance of supply chains with standards in health, environment, and human rights.

## What I learned creating _SupplyTrust_?
- depeened my knowledge in DIDs and VCs
- extensive work with did:cheqd and its ecosystem made me fully grasp this technology's potential and limits
- building websockets
- implementation of OpenID's protocols for issuing and verifying VCs was a big challenge that made me understand the potential and limits of VCs much more


## How I built _SupplyTrust_?
### Tools
- [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-core/) for digitally representing supply chain items
- DID Document versions for digitally representing supply chain events of specific supply chain items
- [did:cheqd] as DID method for integrating DIDs
- [cheqd Studio](https://studio.cheqd.net/) for simplified creation and management of DIDs
- Verifiable Credentials (VCs)
- OpendID for Verifiable Credential Issuance (OID4VCI) as protocol for issuing VCs to supply chain entities to attest their ownership of their recorded supply chain events
- OpendID for Verifiable Presentation (OID4VP) as protocol for verifying VCs for granting access to private IPFS powered by Pinata
- [InterPlanetary File System (IPFS)](https://ipfs.tech/) for off-chain storage to bypass limited DID Document size in cheqd
- [Pinata](https://pinata.cloud) for integrating IPFS while offering supply chain entities the option to store their possibly business relevant supply chain event metadata files in IPFS via´[Web3 API](https://pinata.cloud/features#web3) or in the private IPFS environment powered by Pinata via its [File API](https://pinata.cloud/features#file-api)

## What challenges did I face during creation of _SupplyTrust_?
- implementing OID4VP and OID4VPI from scratch following the official documentation published by OpenID

## What's next for _SupplyTrust_?
- lower cost
- give option for supply chain entities that document their supply chain event privately to add an URL as Linked Domains to the DID Document version of their supply chain event. This URL is then used by other stakeholders to request a VC that enables acess to the private supply chain event metadata file.
- change did creation from internal secret mode to client secret mode (switch from [Credential Service API](https://credential-service.cheqd.net/swagger) to [universal registrar api for Cheqd](https://did-registrar.cheqd.net/api-docs/#/))
- standardize the IPFS data for each supply chain event: producing, shipping, receiving and manufacturing (with the help of supply chain experts). Each of theses standards is a verifiable credential which would additionally add verifiability to the data. These VC about supply chain event claims would then be stored as [Linked Verifiable Presentations](https://identity.foundation/linked-vp/) in the DID Document of the respective supply chain item. Eventually think about specific domains who are willing to use SupplyTrust for their supply chains and create domain specific standards for these domains.
- create an identity registrar so that SupplyTrust can only be accessed as an offical supply chain entity --> done here with the VC based access system