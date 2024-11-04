# SupplyTrust
_SupplyTrust_ is a decentralized Supply Chain data management tool for supply chain entities, such as manufacturers, retailers, or consumers. Through _SupplyTrust_ supply chains become tracable, trackable, and thus trustworthy.

## Use _SupplyTrust_
### Use current test version of _SupplyTrust_
The current test version of _SupplyTrust_ can be found [here](https://supply-trust-8ee27263c820.herokuapp.com/). In order to receive and present the Verifiable Credentials issued by _SupplyTrust_, [grant.io's Data Wallet](https://igrant.io/datawallet.html) is recommended.

### Use _SupplyTrust_ locally
1. Set up:
    - run `npm install` in terminal while being in root folder to download packages for backend
    - run `cd frontend` and run `npm install` again to download packages for frontend
    - go back to root folder by running `cd ..` in terminal
    - add `.env` files...
        - in folder `backend` and add the following env variables:
            - ``CHEQD_CREDENTIAL_SERVICE_TOKEN`` (get it [here](https://docs.cheqd.io/product/getting-started/studio))
            - ``PINATA_API_JWT`` (get it following this [guide](https://docs.pinata.cloud/quickstart))
            - ``PINATA_API_GATEWAY`` (get it following this [guide](https://docs.pinata.cloud/quickstart))
            - ``BASE_URL``="http://localhost:3001"
        - in folder `frontend` and add the following env variables:
            - ``DANGEROUSLY_DISABLE_HOST_CHECK``=true
2. Start running _SupplyTrust_ web app on localhost:
    - run `npm start` in terminal while in root folder (this command automatically starts the backend and frontend)
    **Note**: ensure that `package.json` in folder ``frontend`` contains `proxy=http://localhost:3001` as JSON attribute
3. Test SupplyTrust's tracing and tracking by entering ``did:cheqd:testnet:ecc1d9b3-cd24-4abc-9440-a27f77a38643`` in [tracing and tracking form](http://localhost:3000/trace-and-track)

### Demonstration of usage
How to use _SupplyTrust_ can be seen in this [demo video](https://www.youtube.com/watch?v=UfLoIFfljGA).

## FAQ
### What can be done with _SupplyTrust_?
1. Documenting Supply Chain: _SupplyTrust_ enables its users to document supply chain items and the events in the item's lifecycle, such as production, shipping, receiving, or manufacturing. The supply chain documentation functionality is demonstrated from minute 1:36 onwards in this [video](https://www.youtube.com/watch?v=UfLoIFfljGA).
2. Private documentation: _SupplyTrust_ gives its users the option to store a supply chain item's events in the priavte IPFS environment powered by Pinata. This feature strengthens privacy, desired by users which do not want to publicly reveal their supply chain data, possibly containing business secrets.
3. Tracing and tracking: _SupplyTrust_ provides a simple-to-use interface for tracing and tracking supply chain items based on their DID. The tracking and tracing functionality is demonstrated till minute 1:35 in this [video](https://www.youtube.com/watch?v=UfLoIFfljGA)
4. Managing documents: _SupplyTrust_ enables its users to manage their documents through a simple user interface, giving users an ideal overview of their documents and, in the case of private docuemnts, to whom they have granted access through VC issuance. (Note: this functionality is only showcased and not implemented in the current version of _SupplyTrust_)

### What is the motivation behind _SupplyTrust_?
The idea for _SupplyTrust_ emerged from a pressing need for accountability across supply chains. Currently, many supply chain entities can operate without transparency, allowing room for potential violations of environmental standards, human rights, and legal regulations. _SupplyTrust_ aims to offer a solution that distinguishes responsible entities from those that are less compliant, encouraging ethical practices by providing a trustworthy platform for tracking and tracing supply chain activities. This transparency puts pressure on less responsible actors to disclose their practices or risk losing credibility with consumers.

Furthermore, consumers often lack insight into the origin and handling of the products they purchase, making it difficult to align purchases with personal ethics, dietary restrictions, or environmental concerns. _SupplyTrust_ bridges this gap, empowering consumers with verifiable information about product histories.

For regulators, auditing and enforcing compliance across complex supply chains remains a significant challenge. By adopting _SupplyTrust_, regulators gain a powerful tool to verify that entities adhere to established standards in health, environmental protection, and human rights. Through this system, _SupplyTrust_ can play a vital role in fostering more transparent, accountable, and ethical global supply chains.

### How _SupplyTrust_ was built?
- **DIDs**: _SupplyTrust_ uses [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-core/) to uniquely identify supply chain items, where each version of a DID Document reflects a specific event in that item's lifecycle, such as production, shipping, receiving, or manufacturing. By leveraging the did:cheqd method, _SupplyTrust_ stores these document versions on-chain and sequentially linked, enabling full traceability and transparency for any item identified by its DID. Additionally, DIDs serve to identify users within SupplyTrust, which are supply chain entities, such as manufacturers, distributors, retailers etc.

- **Pinata**: _SupplyTrust_ uses [Pinata](https://pinata.cloud) to efficiently interact with its off-chain storage: IPFS, essential for addressing the DID Document size limitations with did:cheqd. Pinata ensures high data availability and permanence, enhancing the Supplytrust's reliability and performance. Furthermore, Pinata’s private IPFS environment, accessible through the File API, provides _SupplyTrust_ users with a secure option for storing sensitive information. This private IPFS environment is critical, as supply chain entities (e. g., manufacturers) often require confidentiality for their proprietary data, making Pinata an essential element in fostering transparency and traceability while respecting user privacy and business secrets.

- **VCs**: _SupplyTrust_ utilizes [Verifiable Credentials (VCs)](https://www.w3.org/TR/vc-data-model-2.0/) to verify ownership of supply chain entities over their private IPFS files, contributing to Pinata’s hackathon challenge, "Verifiable File Storage." Moreover, these Ownership VCs also enable their holders to manage access to their files on private IPFS and to issue VCs granting others permission as needed. This VC-driven access system contributes to Pinata's challenge, "Identity-Based Access Controls for Private Files".

- **Used Technologies and Tools**:
    - [did:cheqd](https://docs.cheqd.io/product/architecture/adr-list/adr-001-cheqd-did-method) as DID method for integrating DIDs
    - [cheqd Studio](https://studio.cheqd.net/) for simplified creation and management of DID of type did:cheqd
    - [OpendID for Verifiable Credential Issuance (OID4VCI)](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html) as protocol for issuing VCs to supply chain entities to attest their ownership of their recorded supply chain events
    - [OpendID for Verifiable Presentation (OID4VP)](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) as protocol for verifying VCs that grant access to private IPFS files stored in the private IPFS powered by Pinata
    - [InterPlanetary File System (IPFS)](https://ipfs.tech/) for off-chain storage to bypass limited DID Document size in cheqd
    - [Pinata](https://pinata.cloud) for integrating IPFS while offering supply chain entities the option to store their possibly business relevant supply chain event metadata files in IPFS via´[Web3 API](https://pinata.cloud/features#web3) or in the private IPFS environment powered by Pinata via its [File API](https://pinata.cloud/features#file-api)
    - [ReactJS](https://react.dev/) for creating the frontend of _SupplyTrust_
    - [NodeJS](https://nodejs.org/en) and [ExpressJS](https://expressjs.com/) for creating the backend of _SupplyTrust_
    - [Heroku](https://www.heroku.com/) for deploying production version of _SupplyTrust_
    - [grant.io's Data Wallet](https://igrant.io/datawallet.html) for testing OID4VC based issuance and verification in production

### How can supply chain event metadata files in the private IPFS powered by Pinata be private but still accessible by verifiers of the underyling supply chain?
### How can private IPFS supply chain event metadata files be kept secure yet accessible to authorized verifiers?
To enable secure but accessible private supply chain event metadata files, _SupplyTrust_ provides a few methods for verifier access:

1. **Private IPFS Access Credentials**: Verifiers can receive specific access credentials, allowing them to view designated private files. These credentials are VCs that are valid only for specified supply chain event metadata files. Only the file’s author, who is verifiable through _SupplyTrust_'s Private IPFS Ownership Credentials, can issue these access credentials. To further ensure that the issuer of the Private IPFS Access Credentials is indeed the author of the relevant private files, _SupplyTrust_ can verify the controller of the DID Document version that references the specific private file containing the supply chain event metadata.

2. **Ownership-Based Access**: Another way to gain access to private event metadata files is through ownership of the supply chain item itself. _SupplyTrust_ links each supply chain item to a unique DID, controlled by the item's current owner. By verifying the ownership of the item's DID, _SupplyTrust_ can grant the current owner access to the entire history of private event metadata files associated with the item. 

These mechanisms ensure that sensitive data remains protected while providing authorized verifiers with seamless access to relevant supply chain information.

### What's next for _SupplyTrust_
- **Explore alternative DID methods**: To reduce dependency on did:cheqd, we plan to explore other DID methods, particularly [did:ipfs](https://github.com/sid030sid/did-ipfs-service-provider?tab=readme-ov-file#about-didipfs). Adopting an alternative method could potentially lower costs and improve performance, addressing two key areas necessary for _SupplyTrust_’s practical adoption, which currently hinge on did:cheqd.

- **Switch to client secret mode for DID creation**: Transitioning from an internal secret mode to a client secret mode by using the [Universal Registrar API for cheqd](https://did-registrar.cheqd.net/api-docs/) instead of [cheqd Studio](https://studio.cheqd.net/) will eliminate the last centralization point within _SupplyTrust_, helping it achieve full decentralization as a supply chain data management tool.

- **Standardize IPFS data for each supply chain event**: We aim to establish data standards for supply chain events - such as production, shipping, receiving, and manufacturing - with the help of industry experts. Each standard would be represented as a verifiable credential, adding verification capabilities to each event’s data. These credentials would be stored as [Linked Verifiable Presentations](https://identity.foundation/linked-vp/) within the DID Document for each item, ensuring transparent and reliable records that allign with standards of W3C and DIF.

- **Create an identity registrar for official access**: To restrict _SupplyTrust_ access to verified supply chain entities only, we plan to implement an identity registrar. This will involve developing a login interface and authentication process, advancing _SupplyTrust_ beyond its current test version toward secure, entity-restricted access.

- See tasks in file `TODO`