# SupplyTrust
_SupplyTrust_ is a decentralized Supply Chain data management tool for supply chain entities, such as manufacturers, retailers, or consumers. Through _SupplyTrust_ supply chains become tracable, trackable, and thus trustworthy.

## Use _SupplyTrust_
### Use current test version of _SupplyTrust_
The current test version of _SupplyTrust_ can be found [here](https://supply-trust-8ee27263c820.herokuapp.com/).

### Use _SupplyTrust_ locally
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
2. Start running _SupplyTrust_ web app on localhost:
    - run `npm start` in terminal while in root folder (this command automatically starts the backend and frontend)
3. Test SupplyTrust's tracing and tracking by entering ``did:cheqd:testnet:eb41cc0f-b773-440e-b675-0e4310368a52`` in [tracing and tracking form](http://localhost:3000/trace-and-track)

## FAQ
### What inspired me to create _SupplyTrust_?
The idea for _SupplyTrust_ emerged from a pressing need for accountability across supply chains. Currently, many supply chain entities can operate without transparency, allowing room for potential violations of environmental standards, human rights, and legal regulations. _SupplyTrust_ aims to offer a solution that distinguishes responsible entities from those that are less compliant, encouraging ethical practices by providing a trustworthy platform for tracking and tracing supply chain activities. This transparency puts pressure on less responsible actors to disclose their practices or risk losing credibility with consumers.

Furthermore, consumers often lack insight into the origin and handling of the products they purchase, making it difficult to align purchases with personal ethics, dietary restrictions, or environmental concerns. _SupplyTrust_ bridges this gap, empowering consumers with verifiable information about product histories.

For regulators, auditing and enforcing compliance across complex supply chains remains a significant challenge. By adopting _SupplyTrust_, regulators gain a powerful tool to verify that entities adhere to established standards in health, environmental protection, and human rights. Through this system, _SupplyTrust_ can play a vital role in fostering more transparent, accountable, and ethical global supply chains.

### How I built _SupplyTrust_?
- **DIDs**: _SupplyTrust_ uses [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-core/) to uniquely identify supply chain items, where each version of a DID Document reflects a specific event in that item's lifecycle, such as production, shipping, receiving, or manufacturing. By leveraging the did:cheqd method, _SupplyTrust_ stores these document versions on-chain and sequentially linked, enabling full traceability and transparency for any item identified by its DID. Additionally, DIDs serve to identify users within SupplyTrust, which are supply chain entities, such as manufacturers, distributors, retailers etc.

- **Pinata**: _SupplyTrust_ uses [Pinata](https://pinata.cloud) to efficiently interact with its off-chain storage: IPFS, essential for addressing the DID Document size limitations with did:cheqd. Pinata ensures high data availability and permanence, enhancing the Supplytrust's reliability and performance. Furthermore, Pinata’s private IPFS environment, accessible through the File API, provides _SupplyTrust_ users with a secure option for storing sensitive information. This private IPFS environment is critical, as supply chain entities (e. g., manufacturers) often require confidentiality for their proprietary data, making Pinata an essential element in fostering transparency and traceability while respecting user privacy and business secrets.

- **VCs**: _SupplyTrust_ utilizes [Verifiable Credentials (VCs)](https://www.w3.org/TR/vc-data-model-2.0/) to verify ownership of supply chain entities over their private IPFS files, contributing to Pinata’s hackathon challenge, "Verifiable File Storage." Moreover, these Ownership VCs also enable their holders to manage access to their files on private IPFS and to issue VCs granting others permission as needed. This VC-driven access system contributes to Pinata's challenge, "Identity-Based Access Controls for Private Files".

- **Used Technologies and Tools**:
    - [did:cheqd](https://docs.cheqd.io/product/architecture/adr-list/adr-001-cheqd-did-method) as DID method for integrating DIDs
    - [cheqd Studio](https://studio.cheqd.net/) for simplified creation and management of DID of type did:cheqd
    - [OpendID for Verifiable Credential Issuance (OID4VCI)](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html) as protocol for issuing VCs to supply chain entities to attest their ownership of their recorded supply chain events
    - [OpendID for Verifiable Presentation (OID4VP)](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) as protocol for verifying VCs for granting access to private IPFS powered by Pinata
    - [InterPlanetary File System (IPFS)](https://ipfs.tech/) for off-chain storage to bypass limited DID Document size in cheqd
    - [Pinata](https://pinata.cloud) for integrating IPFS while offering supply chain entities the option to store their possibly business relevant supply chain event metadata files in IPFS via´[Web3 API](https://pinata.cloud/features#web3) or in the private IPFS environment powered by Pinata via its [File API](https://pinata.cloud/features#file-api)
    - [ReactJS](https://react.dev/) for creating the frontend of _SupplyTrust_
    - [NodeJS](https://nodejs.org/en) and [ExpressJS](https://expressjs.com/) for creating the backend of _SupplyTrust_
    - [Heroku](https://www.heroku.com/) for deploying production version of _SupplyTrust_
    - [grant.io's Data Wallet](https://igrant.io/datawallet.html) for testing OID4VC based issuance and verification

### What I learned creating _SupplyTrust_
Creating _SupplyTrust_ deepened my understanding of DIDs and VCs, especially as I explored the potential and limitations of the did:cheqd ecosystem in detail. Working extensively with did:cheqd gave me insights into how DIDs can enhance transparency and accountability in supply chains. Additionally, building websockets was a valuable experience, allowing me to handle real-time data flow efficiently. Implementing OpenID protocols to issue and verify VCs was a significant challenge, but it strengthened my grasp of how VCs can be used for secure, decentralized identity verification, highlighting both their capabilities and current limitations in practical applications.

### What challenges did I face during creation of _SupplyTrust_?
- implementing OID4VP and OID4VPI from scratch following the official documentation published by OpenID
- testing _SupplyTrust_ in production with [grant.io's Data Wallet](https://igrant.io/datawallet.html)

### What's next for _SupplyTrust_
- **Explore alternative DID methods**: To reduce dependency on did:cheqd, we plan to explore other DID methods, particularly [did:ipfs](https://github.com/sid030sid/did-ipfs-service-provider?tab=readme-ov-file#about-didipfs). Adopting an alternative method could potentially lower costs and improve performance, addressing two key areas necessary for _SupplyTrust_’s practical adoption, which currently hinge on did:cheqd.

- **Switch to client secret mode for DID creation**: Transitioning from an internal secret mode to a client secret mode by using the [Universal Registrar API for cheqd](https://did-registrar.cheqd.net/api-docs/) instead of [cheqd Studio](https://studio.cheqd.net/) will eliminate the last centralization point within _SupplyTrust_, helping it achieve full decentralization as a supply chain data management tool.

- **Standardize IPFS data for each supply chain event**: We aim to establish data standards for supply chain events - such as production, shipping, receiving, and manufacturing - with the help of industry experts. Each standard would be represented as a verifiable credential, adding verification capabilities to each event’s data. These credentials would be stored as [Linked Verifiable Presentations](https://identity.foundation/linked-vp/) within the DID Document for each item, ensuring transparent and reliable records that allign with standards of W3C and DIF.

- **Create an identity registrar for official access**: To restrict _SupplyTrust_ access to verified supply chain entities only, we plan to implement an identity registrar. This will involve developing a login interface and authentication process, advancing _SupplyTrust_ beyond its current test version toward secure, entity-restricted access.

- **Address potential privacy limitations**: If a file is initially uploaded to public IPFS and then later to private IPFS, _SupplyTrust_ cannot fully guarantee privacy, even if the file is unpinned from the public IPFS. Future work will focus on mechanisms to prevent files from being publicly accessible before they are stored privately, ensuring a higher level of privacy for sensitive supply chain data.