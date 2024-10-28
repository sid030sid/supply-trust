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

module.exports = {
    access_vc_presentation_definition,
    ownership_vc_presentation_definition
};