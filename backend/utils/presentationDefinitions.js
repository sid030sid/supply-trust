const ownership_vc_presentation_definition = {
  id: "PrivateIpfsOwnershipCredential",
  name: "PrivateIpfsOwnershipCredential",
  format: {
    jwt_vc: {
      alg: ["ES256"],
    },
  },
  input_descriptors: [
    {
      id: "ef91319b-81a5-4f71-a602-de3eacccb54b",
      format: {
        jwt_vc: {
          alg: ["ES256", "ES384"],
        },
      },
      constraints: {
        fields: [
          {
            path: ["$.credentialSubject.did", "$.vc.credentialSubject.did"],
          },
          {
            path: ["$.credentialSubject.didDocumentVersion", "$.vc.credentialSubject.didDocumentVersion"],
          },
          {
            path: ["$.credentialSubject.cid", "$.vc.credentialSubject.cid"],
          }
        ],
      },
    },
  ],
}

/* TODO in future
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
              path: ["$.credentialSubject.cid", "$.vc.credentialSubject.cid"],
            },
          ],
        },
      },
    ],
};
*/