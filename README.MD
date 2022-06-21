# HEFLO API

API (Application Programming Interface) to handle customizations on HEFLO BPM using NodeJS and Typescript.

## Installing

Using npm:

```bash
$ npm install heflo-api
```

## Example

Performing an action on a task transition

```js
app.post('/OnExecute', async (request, response) => {
  try {
    // Access all data of the process instance
    let context = new Events.WorkItem.OnExecuteSequenceFlow(request);

    // Yout code here

    // Finally, return unsaved data.  
    response.json(context.GetModifiedData());
  } catch (err) {
    response.status(500);
    esponse.send("Error executing the request, details: " + err);
  }
});
```

Changing the value of a field of a form

```js
app.post('/onChanged', async (request, response) => {
  try {
    // Access all data of the process instance
    let context = new Events.WorkItem.OnChanged(request);

    // change another field
    context.WorkItem.Set("OtherField", "Field changed");

      // Finally, return unsaved data.  
    response.json(context.GetModifiedData());
  } catch (err) {
    response.status(500);
    esponse.send("Error executing the request, details: " + err);
  }
});
```

Performing the calculation of who will perform a task

```js
app.post('/OnResourceCalculation', async (request, response) => {
  try {
    // Access all data of the process instance
    let context = new Events.WorkItem.OnResourceCalculation(request);

    // Your code here.
  
    // Finally, return list of emails
    response.json( [ "email1@mycompany.com", "email2@mycompany.com", ["name-of-department-or-group"] ] );
  } catch (err) {
    response.status(500);
    esponse.send("Error executing the request, details: " + err);
  }
});
```

Creating a new record of type Person

```js
app.post('/OnExecute', async (request, response) => {
  try {
    // Access all data of the process instance
    let context = new Events.WorkItem.OnExecuteSequenceFlow(request);

    let person = await Person.NewAsync(context);
    person.Name = context.WorkItem.Get("name_person");
    person.Email = context.WorkItem.Get("email_person");
    // save the record using async 
    await pessoa.SaveAsync(context);

    // No need to return modified data
    response.json("{}");
  } catch (err) {
    response.status(500);
    esponse.send("Error executing the request, details: " + err);
  }
});
```