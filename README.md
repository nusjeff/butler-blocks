# Butler Blocks
[![butler-blocks CI](https://github.com/butlerlabs/butler-blocks/actions/workflows/build_n_test.yml/badge.svg?branch=master&event=push)](https://github.com/butlerlabs/butler-blocks/actions/workflows/build_n_test.yml)

<b>Butler Blocks is a JavaScript library that helps developers build incredible document processing and review experiences into their apps.</b>

![Butler Blocks gif](https://butler-public-assets.s3.amazonaws.com/butler_blocks.gif)

Combined with Butler's [document extraction APIs](https://www.butlerlabs.ai/landing-pages/document-ai-ocr?), developers can use this library to eliminate manual data entry for their users. 

---

## Reference to past releases
* [butler-block v1.0](https://github.com/butlerlabs/butler-blocks/blob/master/docs/version_1_0.md)


## Install Butler Blocks (latest v1.1)

```bash
npm install butler-blocks
// OR
yarn add butler-blocks
```

## Using Butler Blocks

### Load Butler Blocks with your API Key

Note: You'll need your API key, which can be found
on the settings page of the [Butler Product](https://app.butlerlabs.ai/settings).

```js
import { loadButlerBlocks } from 'butler-blocks';

//...

// Get this API key from your Butler Account!
const myApiKey = 'MY_API_KEY';

const butlerBlocks = loadButlerBlocks(myApiKey);

//...
```

### Fetch and display document extraction results

Note: Before fetching data, you'll need to use the Butler core product to create a document extraction model, and
then use the REST APIs to upload documents to that model.

For details on how to get started, check out the [documentation](https://docs.butlerlabs.ai/reference/welcome)

#### Add the Document Labeler component to your HTML code

```html
<body>
  <!-- We will put our Butler Block component inside this div. -->
  <!-- Note that you can add custom styling to the container here as you wish -->
  <div
    id="ButlerDocumentLabeler"
    style="height: calc(100vh - 32px); width: calc(100vw - 32px); padding: 8px"
  ></div>

  <!-- ... -->
</body>
```

#### Initialize the Butler Blocks library and load data from the REST APIs

```js
import { loadButlerBlocks } from 'butler-blocks';

// Step 1: Initialize Butler Blocks with your API Key

// Get this API key from your Butler Account!
const myApiKey = 'MY_API_KEY';

const butlerBlocks = loadButlerBlocks(myApiKey);

// Step 2: Get your Document Info

// Get this info from the API response when you upload your documents!
const myDocument = {
  modelId: 'MY_MODEL_ID',
  documentId: 'MY_DOCUMENT_ID',
};

// Step 3: Fetch data about your document from Butler
const fetchDocumentData = async (modelId, documentId) => {
  const extractionResultsResponse =
    await butlerBlocks.api.getExtractionResults(modelId, documentId);
  const { data } = extractionResultsResponse;
  return data;
}

// Step 4: Handle saving labels

// Define a submit labels function, which will pass the output of the
// document labeler to the API to help train your model!
const submitLabels = async (trainingDocumentLabels) => {
  await butlerBlocks.api.submitDocumentLabels(
    myDocument.modelId,
    myDocument.documentId,
    trainingDocumentLabels.results
  );
}

// This function defines what action to take when the user clicks
// the save button in the document labeler
const onSaveCallback = (docInfo) => {
    submitLabels(docInfo.trainingDocumentLabels);
};

// Step 5: Initialize your Document Labeler!

// This function will inject the Butler Document Labeler into the
// div element you specified earlier with the fetched document data
const initializeDocLabeler = async ({ modelId, documentId }) => {
  // using the function we defined earlier to fetch document data
  const data = await fetchDocumentData(modelId, documentId);

  // Note: the first parameter for this function should be the Id
  // that you specified in your html div element
  butlerBlocks.createDocLabeler('ButlerDocumentLabeler', data, {
    onSaveCallback,
    // saveActionButtonText: 'Confirm',
    // fieldDisplayNameFormatter: (fieldName) => {
    //   switch (fieldName) {
    //     case 'po_number':
    //       return 'PO Number';
    //     case 'shipped_date':
    //       return 'Shipped Date';
    //     case 'part_number':
    //       return 'Part Number';
    //     default:
    //       return fieldName;
    //   }
    // },
    // displayOnly: true,
    // hideSaveButton: true,
    // onLabelUpdate: (docInfo: DocumentLabelerOutputDataDto) => {
    //  console.log('Label changed', docInfo)
    // }
  });
};

// Call this function when you want to display the labeler!
initializeDocLabeler(myDocument);
```


### Configuration Option Api


| Param          | Type     | Required | Default | Description                                                                               |
|----------------|----------|----------|---------|----------------------------------------------------------------------------------|
| onSaveCallback | Function | <li> [x] </li>     | None |Method called after clicking the save button with latest label changes |
| onLabelUpdate  | Function | <li> [ ]  </li>    | undefined | Callback method used to listen for label changes. can be used to implement custom save UI |
| hideSaveButton | Boolean  | <li> [ ] </li>     | false | Removes the save button from the UI |
| displayOnly    | Boolean  | <li> [ ] </li>     | false | Toggle display only model which removes all the edit and save UI elements |
| fieldDisplayNameFormatter | Function  | <li> [ ] </li>  | undefined    | Used to format or change the field name display |
