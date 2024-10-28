const access_vc_presentation_definition = {
    id: "046acbac-ea8d-4f95-8b57-f58dd178132a",
    name: "PrivateIpfsAccessCredential",
    format: {
      jwt_vc: {
        alg: ["ES256"],
      },
    },
    input_descriptors: [
      {
        id: "ef91319b-81a5-4f71-a602-de3eacccb54a",
        constraints: {
          fields: [
            {
              path: ["$.credentialSubject.cid"],
            },
          ],
        },
      },
    ],
};

const ownership_vc_presentation_definition = {
  id: "046acbac-ea8d-4f95-8b57-f58dd178132b",
  name: "PrivateIpfsOwnershipCredential",
  format: {
    jwt_vc: {
      alg: ["ES256"],
    },
  },
  input_descriptors: [
    {
      id: "ef91319b-81a5-4f71-a602-de3eacccb54b",
      constraints: {
        fields: [
          {
            path: ["$.credentialSubject.cid"],
          },
        ],
      },
    },
  ],
}

const vc_presentation_definition = {
  "id": "vc_presentation_definition",
  "input_descriptors": [
    {
      "id": "verifiable_credential",
      "name": "Verifiable Credential with CID",
      "purpose": "To verify a credential containing a credentialSubject with a cid property.",
      "schema": [
        {
          "uri": "https://www.w3.org/2018/credentials#VerifiableCredential"
        }
      ],
      "constraints": {
        "fields": [
          {
            "path": ["$.credentialSubject.cid"],
            "purpose": "The credential must contain a 'cid' in the credentialSubject."
          },
          {
            "path": ["$.type"],
            "filter": {
              "type": "array",
              "contains": {
                "const": "VerifiableCredential"
              }
            },
            "purpose": "The credential type must include 'VerifiableCredential'."
          }
        ]
      }
    }
  ]
}


module.exports = {
  access_vc_presentation_definition,
  ownership_vc_presentation_definition,
  vc_presentation_definition
};