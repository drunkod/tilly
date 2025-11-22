---
inclusion: always
---
<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
-------------------------------------------------------------------------------------> 
# Jazz (vanilla)

## Getting started

### Overview
# Learn some Jazz 

**Jazz is a new kind of database** that's **distributed** across your frontend, containers, serverless functions and its own storage cloud.

It syncs structured data, files and LLM streams instantly, and looks like local reactive JSON state.

It also provides auth, orgs & teams, real-time multiplayer, edit histories, permissions, E2E encryption and offline-support out of the box.

---

## Quickstart

**Want to learn the basics?** Check out our [quickstart guide](/docs/quickstart) for a step-by-step guide to building a simple app with Jazz.

**Just want to get started?** You can use [create-jazz-app](/docs/tooling-and-resources/create-jazz-app) to create a new Jazz project from one of our starter templates or example apps:

```sh
  npx create-jazz-app@latest --api-key you@example.com

```

**Using an LLM?** [Add our llms.txt](/vanilla/llms-full.txt) to your context window!

**Info:** 

Requires at least Node.js v20\. See our [Troubleshooting Guide](/docs/troubleshooting) for quick fixes.

## How it works

1. **Define your data** with CoValues schemas
2. **Connect to storage infrastructure** (Jazz Cloud or self-hosted)
3. **Create and edit CoValues** like normal objects
4. **Get automatic sync and persistence** across all devices and users

Your UI updates instantly on every change, everywhere. It's like having reactive local state that happens to be shared with the world.

## Ready to see Jazz in action?

Have a look at our [example apps](/examples) for inspiration and to see what's possible with Jazz. From real-time chat and collaborative editors to file sharing and social features — these are just the beginning of what you can build.

## Core concepts

Learn how to structure your data using [collaborative values](/docs/core-concepts/covalues/overview) — the building blocks that make Jazz apps work.

## Sync and storage

Sync and persist your data by setting up [sync and storage infrastructure](/docs/core-concepts/sync-and-storage) using Jazz Cloud, or host it yourself.

## Going deeper

Get better results with AI by [importing the Jazz docs](/docs/tooling-and-resources/ai-tools) into your context window.

If you have any questions or need assistance, please don't hesitate to reach out to us on [Discord](https://discord.gg/utDMjHYg42). We'd love to help you get started.


### Quickstart
# Get started with Jazz  in 10 minutes

This quickstart guide will take you from an empty project to a working app with a simple data model and components to create and display your data.

## Create your App

**Note: Requires Node.js 20+**

## Install Jazz

The `jazz-tools` package includes everything you're going to need to build your first Jazz app.

```sh
npm install jazz-tools

```

## Get your free API key

Sign up for a free API key at [dashboard.jazz.tools](https://dashboard.jazz.tools) for higher limits or production use, or use your email address as a temporary key to get started quickly.

```bash
NEXT_PUBLIC_JAZZ_API_KEY="you@example.com" # or your API key

```

## Define your schema

Jazz uses Zod for more simple data types (like strings, numbers, booleans), and its own schemas to create collaborative data structures known as CoValues. CoValues are automatically persisted across your devices and the cloud and synced in real-time. Here we're defining a schema made up of both Zod types and CoValues.

Adding a `root` to the user's account gives us a container that can be used to keep a track of all the data a user might need to use the app. The migration runs when the user logs in, and ensures the account is properly set up before we try to use it.

```ts
import { co, z } from "jazz-tools";

export const Band = co.map({
  name: z.string(), // Zod primitive type
});

export const Festival = co.list(Band);

export const JazzFestAccountRoot = co.map({
  myFestival: Festival,
});

export const JazzFestAccount = co
  .account({
    root: JazzFestAccountRoot,
    profile: co.profile(),
  })
  .withMigration((account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        myFestival: [],
      });
    }
  });

```

## Add the Jazz Provider

Wrap your app with a provider so components can use Jazz.

```tsx
import { JazzWrapper } from "@/app/components/JazzWrapper";

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
  <html lang="en">
    <body>
      <JazzWrapper>{children}</JazzWrapper>
    </body>
  </html>
);
}

```

## Start your app

Moment of truth — time to start your app and see if it works.

```bash
npm run dev

```

### Not loading?

If you're not seeing the welcome page:

**Info: Still stuck?** Ask for help on [Discord](https://discord.gg/utDMjHYg42)!

## Create data

Let's create a simple form to add a new band to the festival. We'll use the `useAccount` hook to get the current account and tell Jazz to load the `myFestival` CoValue by passing a `resolve` query.

```tsx
"use client";
import { useAccount } from "jazz-tools/react";
import { JazzFestAccount } from "@/app/schema";
import { useState } from "react";

export function NewBand() {
  const me = useAccount(JazzFestAccount, {
    resolve: { root: { myFestival: true } },
  });
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!me.$isLoaded) return;
    me.root.myFestival.$jazz.push({ name });
    setName("");
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        placeholder="Band name"
        onChange={(e) => setName(e.target.value)}
      />
      <button type="button" onClick={handleSave}>
        Add
      </button>
    </div>
  );
}

```

## Display your data

Now we've got a way to create data, so let's add a component to display it.

```tsx
"use client";
import { useAccount } from "jazz-tools/react";
import { JazzFestAccount } from "@/app/schema";

export function Festival() {
  const me = useAccount(JazzFestAccount, {
    resolve: {
      root: {
        myFestival: {
          $each: true
        }
      }
    },
  });
  if (!me.$isLoaded) return null;
  return (
    <ul>
      {me.root.myFestival.map(
        (band) => band && <li key={band.$jazz.id}>{band.name}</li>,
      )}
    </ul>
  );
}

```

## Put it all together

You've built all your components, time to put them together.

```tsx
import { Festival } from "@/app/components/Festival";
import { NewBand } from "@/app/components/NewBand";

export default function Home() {
  return (
    <main>
      <h1>🎪 My Festival</h1>
      <NewBand />
      <Festival />
    </main>
  );
}

```

You should now be able to add a band to your festival, and see it appear in the list!

**Congratulations! 🎉** You've built your first Jazz app!

You've begun to scratch the surface of what's possible with Jazz. Behind the scenes, your local-first JazzFest app is **already** securely syncing your data to the cloud in real-time, ready for you to build more and more powerful features.

## Next steps

* [Add authentication](/docs/key-features/authentication/quickstart) to your app so that you can log in and view your data wherever you are!
* Dive deeper into the collaborative data structures we call [CoValues](/docs/core-concepts/covalues/overview)
* Learn how to share and [collaborate on data](/docs/permissions-and-sharing/overview) using groups and permissions
* Complete the [server-side quickstart](/docs/server-side/quickstart) to learn more about Jazz on the server


### Installation
# Providers

* **Data Synchronization**: Manages connections to peers and the Jazz cloud
* **Local Storage**: Persists data locally between app sessions
* **Schema Types**: Provides APIs for the [AccountSchema](/docs/core-concepts/schemas/accounts-and-migrations)
* **Authentication**: Connects your authentication system to Jazz

## Setting up the Provider

The provider accepts several configuration options:

```tsx
import { JazzReactProvider } from "jazz-tools/react";
import { MyAppAccount } from "./schema";

export function MyApp({ children }: { children: React.ReactNode }) {
return (
  <JazzReactProvider
    sync={{
      peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
      when: "always", // When to sync: "always", "never", or "signedUp"
    }}
    AccountSchema={MyAppAccount}
  >
    {children}
  </JazzReactProvider>
);
}

```

**Info: Tip** 

Sign up for a free API key at [dashboard.jazz.tools](https://dashboard.jazz.tools) for higher limits or production use, or use your email address as a temporary key to get started quickly.

```bash
NEXT_PUBLIC_JAZZ_API_KEY="you@example.com" # or your API key

```

## Provider Options

### Sync Options

The `sync` property configures how your application connects to the Jazz network:

```ts
import { type SyncConfig } from "jazz-tools";

export const syncConfig: SyncConfig = {
// Connection to Jazz Cloud or your own sync server
peer: `wss://cloud.jazz.tools/?key=${apiKey}`,

// When to sync: "always" (default), "never", or "signedUp"
when: "always",
};

```

See [Authentication States](/docs/key-features/authentication/authentication-states#controlling-sync-for-different-authentication-states) for more details on how the `when` property affects synchronization based on authentication state.

### Account Schema

The `AccountSchema` property defines your application's account structure:

```tsx
import { JazzReactProvider } from "jazz-tools/react";
import { MyAppAccount } from "./schema";

export function MyApp({ children }: { children: React.ReactNode }) {
  return (
    <JazzReactProvider
      sync={{
        peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
        when: "always", // When to sync: "always", "never", or "signedUp"
      }}
      AccountSchema={MyAppAccount}
    >
      {children}
    </JazzReactProvider>
  );
}

```

### Additional Options

The provider accepts these additional options:

## Authentication

## Need Help?

If you have questions about configuring the Jazz Provider for your specific use case, [join our Discord community](https://discord.gg/utDMjHYg42) for help.


### Troubleshooting
# Setup troubleshooting

A few reported setup hiccups and how to fix them.

---

## Node.js version requirements

Jazz requires **Node.js v20 or later** due to native module dependencies.  
Check your version:

```sh
node -v

```

If you’re on Node 18 or earlier, upgrade via nvm:

```sh
nvm install 20
nvm use 20

```

---

### Required TypeScript Configuration

In order to build successfully with TypeScript, you must ensure that you have the following options configured (either in your `tsconfig.json` or using the command line):

* `skipLibCheck` must be `true`
* `exactOptionalPropertyTypes` must be `false`

---

## npx jazz-run: command not found

If, when running:

```sh
npx jazz-run sync

```

you encounter:

```sh
sh: jazz-run: command not found

```

This is often due to an npx cache quirk. (For most apps using Jazz)

1. Clear your npx cache:

```sh
npx clear-npx-cache

```

1. Rerun the command:

```sh
npx jazz-run sync

```

---

### Node 18 workaround (rebuilding the native module)

If you can’t upgrade to Node 20+, you can rebuild the native `better-sqlite3` module for your architecture.

1. Install `jazz-run` locally in your project:

```sh
pnpm add -D jazz-run

```

1. Find the installed version of better-sqlite3 inside node\_modules. It should look like this:

```sh
./node_modules/.pnpm/better-sqlite3{version}/node_modules/better-sqlite3

```

Replace `{version}` with your installed version and run:

```sh
# Navigate to the installed module and rebuild
pushd ./node_modules/.pnpm/better-sqlite3{version}/node_modules/better-sqlite3
&& pnpm install
&& popd

```

If you get ModuleNotFoundError: No module named 'distutils': Linux:

```sh
pip install --upgrade setuptools

```

macOS:

```sh
brew install python-setuptools

```

_Workaround originally shared by @aheissenberger on Jun 24, 2025._

---

### Still having trouble?

If none of the above fixes work:

Make sure dependencies installed without errors (`pnpm install`).

Double-check your `node -v` output matches the required version.

Open an issue on GitHub with:

* Your OS and version
* Node.js version
* Steps you ran and full error output

We're always happy to help! If you're stuck, reachout via [Discord](https://discord.gg/utDMjHYg42)


## Upgrade guides

### 0.19.0 - Explicit loading states


### 0.18.0 - New `$jazz` field in CoValues


### 0.17.0 - New image APIs


### 0.16.0 - Cleaner separation between Zod and CoValue schemas


### 0.15.0 - Everything inside `jazz-tools`


### 0.14.0 - Zod-based schemas


## Core Concepts

### Overview
# Defining schemas: CoValues

**CoValues ("Collaborative Values") are the core abstraction of Jazz.** They're your bread-and-butter datastructures that you use to represent everything in your app.

As their name suggests, CoValues are inherently collaborative, meaning **multiple users and devices can edit them at the same time.**

**Think of CoValues as "super-fast Git for lots of tiny data."**

* CoValues keep their full edit histories, from which they derive their "current state".
* The fact that this happens in an eventually-consistent way makes them [CRDTs](https://en.wikipedia.org/wiki/Conflict-free%5Freplicated%5Fdata%5Ftype).
* Having the full history also means that you often don't need explicit timestamps and author info - you get this for free as part of a CoValue's [edit metadata](/docs/key-features/history).

CoValues model JSON with CoMaps and CoLists, but also offer CoFeeds for simple per-user value feeds, and let you represent binary data with FileStreams.

## Start your app with a schema

Fundamentally, CoValues are as dynamic and flexible as JSON, but in Jazz you use them by defining fixed schemas to describe the shape of data in your app.

This helps correctness and development speed, but is particularly important...

* when you evolve your app and need migrations
* when different clients and server workers collaborate on CoValues and need to make compatible changes

Thinking about the shape of your data is also a great first step to model your app.

Even before you know the details of how your app will work, you'll probably know which kinds of objects it will deal with, and how they relate to each other.

In Jazz, you define schemas using `co` for CoValues and `z` (from [Zod](https://zod.dev/)) for their primitive fields.

**File name: schema.ts**

```ts
import { co, z } from "jazz-tools";

export const TodoProject = co.map({
  title: z.string(),
  tasks: ListOfTasks,
});

```

This gives us schema info that is available for type inference _and_ at runtime.

Check out the inferred type of `project` in the example below, as well as the input `.create()` expects.

```ts
import { Group } from "jazz-tools";
import { TodoProject, ListOfTasks } from "./schema";

const project = TodoProject.create(
  {
    title: "New Project",
    tasks: ListOfTasks.create([], Group.create()),
  },
  Group.create(),
);

```

When creating CoValues that contain other CoValues, you can pass in a plain JSON object. Jazz will automatically create the CoValues for you.

```ts
const group = Group.create().makePublic();
const publicProject = TodoProject.create(
  {
    title: "New Project",
    tasks: [], // Permissions are inherited, so the tasks list will also be public
  },
  group,
);

```

**Info:** 

To learn more about how permissions work when creating nested CoValues with plain JSON objects, refer to [Ownership on implicit CoValue creation](/docs/permissions-and-sharing/cascading-permissions#ownership-on-implicit-covalue-creation).

## Types of CoValues

### `CoMap` (declaration)

CoMaps are the most commonly used type of CoValue. They are the equivalent of JSON objects (Collaborative editing follows a last-write-wins strategy per-key).

You can either declare struct-like CoMaps:

```ts
export const Task = co.map({
  title: z.string(),
  completed: z.boolean(),
});

```

Or record-like CoMaps (key-value pairs, where keys are always `string`):

```ts
export const ColourToHex = co.record(z.string(), z.string());
export const ColorToFruit = co.record(z.string(), Fruit);

```

See the corresponding sections for [creating](/docs/core-concepts/covalues/comaps#creating-comaps),[subscribing/loading](/docs/core-concepts/subscription-and-loading),[reading from](/docs/core-concepts/covalues/comaps#reading-from-comaps) and[updating](/docs/core-concepts/covalues/comaps#updating-comaps) CoMaps.

### `CoList` (declaration)

CoLists are ordered lists and are the equivalent of JSON arrays. (They support concurrent insertions and deletions, maintaining a consistent order.)

You define them by specifying the type of the items they contain:

```ts
export const ListOfColors = co.list(z.string());
export const ListOfTasks = co.list(Task);

```

See the corresponding sections for [creating](/docs/core-concepts/covalues/colists#creating-colists),[subscribing/loading](/docs/core-concepts/subscription-and-loading),[reading from](/docs/core-concepts/covalues/colists#reading-from-colists) and[updating](/docs/core-concepts/covalues/colists#updating-colists) CoLists.

### `CoFeed` (declaration)

CoFeeds are a special CoValue type that represent a feed of values for a set of users/sessions (Each session of a user gets its own append-only feed).

They allow easy access of the latest or all items belonging to a user or their sessions. This makes them particularly useful for user presence, reactions, notifications, etc.

You define them by specifying the type of feed item:

```ts
export const FeedOfTasks = co.feed(Task);

```

See the corresponding sections for [creating](/docs/core-concepts/covalues/overview#creating-cofeeds),[subscribing/loading](/docs/core-concepts/subscription-and-loading),[reading from](/docs/core-concepts/covalues/cofeeds#reading-from-cofeeds) and[writing to](/docs/core-concepts/covalues/cofeeds#writing-to-cofeeds) CoFeeds.

### `FileStream` (declaration)

FileStreams are a special type of CoValue that represent binary data. (They are created by a single user and offer no internal collaboration.)

They allow you to upload and reference files.

You typically don't need to declare or extend them yourself, you simply refer to the built-in `co.fileStream()` from another CoValue:

```ts
export const Document = co.map({
  title: z.string(),
  file: co.fileStream(),
});

```

See the corresponding sections for [creating](/docs/core-concepts/covalues/filestreams#creating-filestreams),[subscribing/loading](/docs/core-concepts/subscription-and-loading),[reading from](/docs/core-concepts/covalues/filestreams#reading-from-filestreams) and[writing to](/docs/core-concepts/covalues/filestreams#writing-to-filestreams) FileStreams.

**Note: For images, we have a special, higher-level `co.image()` helper, see [ImageDefinition](/docs/core-concepts/covalues/imagedef).**

### Unions of CoMaps (declaration)

You can declare unions of CoMaps that have discriminating fields, using `co.discriminatedUnion()`.

```ts
export const ButtonWidget = co.map({
  type: z.literal("button"),
  label: z.string(),
});

export const SliderWidget = co.map({
  type: z.literal("slider"),
  min: z.number(),
  max: z.number(),
});

export const WidgetUnion = co.discriminatedUnion("type", [
  ButtonWidget,
  SliderWidget,
]);

```

See the corresponding sections for [creating](/docs/core-concepts/schemas/schemaunions#creating-schema-unions),[subscribing/loading](/docs/core-concepts/subscription-and-loading) and[narrowing](/docs/core-concepts/schemas/schemaunions#narrowing-unions) schema unions.

## CoValue field/item types

Now that we've seen the different types of CoValues, let's see more precisely how we declare the fields or items they contain.

### Primitive fields

You can declare primitive field types using `z` (re-exported in `jazz-tools` from [Zod](https://zod.dev/)).

Here's a quick overview of the primitive types you can use:

```ts
z.string(); // For simple strings
z.number(); // For numbers
z.boolean(); // For booleans
z.date(); // For dates
z.literal(["waiting", "ready"]); // For enums

```

Finally, for more complex JSON data, that you _don't want to be collaborative internally_ (but only ever update as a whole), you can use more complex Zod types.

For example, you can use `z.object()` to represent an internally immutable position:

```ts
const Sprite = co.map({
  // assigned as a whole
  position: z.object({ x: z.number(), y: z.number() }),
});

```

Or you could use a `z.tuple()`:

```ts
const SpriteWithTuple = co.map({
  // assigned as a whole
  position: z.tuple([z.number(), z.number()]),
});

```

### References to other CoValues

To represent complex structured data with Jazz, you form trees or graphs of CoValues that reference each other.

Internally, this is represented by storing the IDs of the referenced CoValues in the corresponding fields, but Jazz abstracts this away, making it look like nested CoValues you can get or assign/insert.

The important caveat here is that **a referenced CoValue might or might not be loaded yet,** but we'll see what exactly that means in [Subscribing and Deep Loading](/docs/core-concepts/subscription-and-loading).

In Schemas, you declare references by just using the schema of the referenced CoValue:

```ts
const Person = co.map({
  name: z.string(),
});

const ListOfPeople = co.list(Person);

const Company = co.map({
  members: ListOfPeople,
});

```

#### Optional References

You can make schema fields optional using either `z.optional()` or `co.optional()`, depending on the type of value:

* Use `z.optional()` for primitive Zod values like `z.string()`, `z.number()`, or `z.boolean()`
* Use `co.optional()` for CoValues like `co.map()`, `co.list()`, or `co.record()`

You can make references optional with `co.optional()`:

```ts
const PersonWithOptionalProperties = co.map({
  age: z.optional(z.number()), // primitive
  pet: co.optional(Pet), // CoValue
});

```

#### Recursive References

You can wrap references in getters. This allows you to defer evaluation until the property is accessed. This technique is particularly useful for defining circular references, including recursive (self-referencing) schemas, or mutually recursive schemas.

```ts
const SelfReferencingPerson = co.map({
  name: z.string(),
  get bestFriend() {
    return Person;
  },
});

```

You can use the same technique for mutually recursive references:

```ts
const MutuallyRecursivePerson = co.map({
  name: z.string(),
  get friends() {
    return ListOfFriends;
  },
});

const ListOfFriends = co.list(Person);

```

If you try to reference `ListOfPeople` in `Person` without using a getter, you'll run into a `ReferenceError` because of the [temporal dead zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal%5Fdead%5Fzone%5Ftdz).

### Helper methods

If you find yourself repeating the same logic to access computed CoValues properties, you can define helper functions to encapsulate it for better reusability:

```ts
const Person = co.map({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date(),
});
type Person = co.loaded<typeof Person>;

export function getPersonFullName(person: Person) {
  return `${person.firstName} ${person.lastName}`;
}

function differenceInYears(date1: Date, date2: Date) {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));
}

export function getPersonAgeAsOf(person: Person, date: Date) {
  return differenceInYears(date, person.dateOfBirth);
}

const person = Person.create({
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date("1990-01-01"),
});

const fullName = getPersonFullName(person);
const age = getPersonAgeAsOf(person, new Date());

```

Similarly, you can encapsulate logic needed to update CoValues:

```ts
export function updatePersonName(person: Person, fullName: string) {
  const [firstName, lastName] = fullName.split(" ");
  person.$jazz.set("firstName", firstName);
  person.$jazz.set("lastName", lastName);
}

console.log(person.firstName, person.lastName); // John Doe

updatePersonName(person, "Jane Doe");

console.log(person.firstName, person.lastName); // Jane Doe

```


### CoMaps
# CoMaps

CoMaps are key-value objects that work like JavaScript objects. You can access properties with dot notation and define typed fields that provide TypeScript safety. They're ideal for structured data that needs type validation.

## Creating CoMaps

CoMaps are typically defined with `co.map()` and specifying primitive fields using `z` (see [Defining schemas: CoValues](/docs/core-concepts/covalues/overview) for more details on primitive fields):

```ts
import { co, z } from "jazz-tools";

const Project = co.map({
  name: z.string(),
  startDate: z.date(),
  status: z.literal(["planning", "active", "completed"]),
  coordinator: co.optional(Member),
});
export type Project = co.loaded<typeof Project>;
export type ProjectInitShape = co.input<typeof Project>; // type accepted by `Project.create`

```

You can create either struct-like CoMaps with fixed fields (as above) or record-like CoMaps for key-value pairs:

```ts
const Inventory = co.record(z.string(), z.number());

```

To instantiate a CoMap:

```ts
const project = Project.create({
  name: "Spring Planting",
  startDate: new Date("2025-03-15"),
  status: "planning",
});

const inventory = Inventory.create({
  tomatoes: 48,
  basil: 12,
});

```

### Ownership

When creating CoMaps, you can specify ownership to control access:

```ts
// Create with default owner (current user)
const privateProject = Project.create({
  name: "My Herb Garden",
  startDate: new Date("2025-04-01"),
  status: "planning",
});

// Create with shared ownership
const gardenGroup = Group.create();
gardenGroup.addMember(memberAccount, "writer");

const communityProject = Project.create(
  {
    name: "Community Vegetable Plot",
    startDate: new Date("2025-03-20"),
    status: "planning",
  },
  { owner: gardenGroup },
);

```

See [Groups as permission scopes](/docs/permissions-and-sharing/overview) for more information on how to use groups to control access to CoMaps.

## Reading from CoMaps

CoMaps can be accessed using familiar JavaScript object notation:

```ts
console.log(project.name); // "Spring Planting"
console.log(project.status); // "planning"

```

### Handling Optional Fields

Optional fields require checks before access:

```ts
if (project.coordinator) {
  console.log(project.coordinator.name); // Safe access
}

```

### Recursive references

You can wrap references in getters. This allows you to defer evaluation until the property is accessed. This technique is particularly useful for defining circular references, including recursive (self-referencing) schemas, or mutually recursive schemas.

```ts
import { co, z } from "jazz-tools";

const Project = co.map({
  name: z.string(),
  startDate: z.date(),
  status: z.literal(["planning", "active", "completed"]),
  coordinator: co.optional(Member),
  get subProject() {
    return Project.optional();
  },
});

export type Project = co.loaded<typeof Project>;

```

When the recursive references involve more complex types, it is sometimes required to specify the getter return type:

```ts
const ProjectWithTypedGetter = co.map({
  name: z.string(),
  startDate: z.date(),
  status: z.literal(["planning", "active", "completed"]),
  coordinator: co.optional(Member),
  // [!code ++:3]
  get subProjects(): co.Optional<co.List<typeof Project>> {
    return co.optional(co.list(Project));
  },
});

export type Project = co.loaded<typeof Project>;

```

### Partial

For convenience Jazz provies a dedicated API for making all the properties of a CoMap optional:

```ts
const Project = co.map({
  name: z.string(),
  startDate: z.date(),
  status: z.literal(["planning", "active", "completed"]),
});

const ProjectDraft = Project.partial();

// The fields are all optional now
const project = ProjectDraft.create({});

```

### Pick

You can also pick specific fields from a CoMap:

```ts
const Project = co.map({
  name: z.string(),
  startDate: z.date(),
  status: z.literal(["planning", "active", "completed"]),
});

const ProjectStep1 = Project.pick({
  name: true,
  startDate: true,
});

// We don't provide the status field
const project = ProjectStep1.create({
  name: "My project",
  startDate: new Date("2025-04-01"),
});

```

### Working with Record CoMaps

For record-type CoMaps, you can access values using bracket notation:

```ts
const inventory = Inventory.create({
  tomatoes: 48,
  peppers: 24,
  basil: 12,
});

console.log(inventory["tomatoes"]); // 48

```

## Updating CoMaps

To update a CoMap's properties, use the `$jazz.set` method:

```ts
project.$jazz.set("name", "Spring Vegetable Garden"); // Update name
project.$jazz.set("startDate", new Date("2025-03-20")); // Update date

```

**Info:** 

The `$jazz` namespace is available on all CoValues, and provides access to methods to modify and load CoValues, as well as access common properties like `id` and `owner`.

When updating references to other CoValues, you can provide both the new CoValue or a JSON object from which the new CoValue will be created.

```ts
const Dog = co.map({
  name: co.plainText(),
});
const Person = co.map({
  name: co.plainText(),
  dog: Dog,
});

const person = Person.create({
  name: "John",
  dog: { name: "Rex" },
});

// Update the dog field using a CoValue
person.$jazz.set("dog", Dog.create({ name: co.plainText().create("Fido") }));
// Or use a plain JSON object
person.$jazz.set("dog", { name: "Fido" });

```

When providing a JSON object, Jazz will automatically create the CoValues for you. To learn more about how permissions work in this case, refer to[Ownership on implicit CoValue creation](/docs/permissions-and-sharing/cascading-permissions#ownership-on-implicit-covalue-creation).

### Type Safety

CoMaps are fully typed in TypeScript, giving you autocomplete and error checking:

```ts
project.$jazz.set("name", "Spring Vegetable Planting"); // ✓ Valid string
// [!code --]
project.$jazz.set("startDate", "2025-03-15"); // ✗ Type error: expected Date
// [!code --]
// Argument of type 'string' is not assignable to parameter of type 'Date'

```

### Soft Deletion

Implementing a soft deletion pattern by using a `deleted` flag allows you to maintain data for potential recovery and auditing.

```ts
const Project = co.map({
  name: z.string(),
  // [!code ++]
  deleted: z.optional(z.boolean()),
});

```

When an object needs to be "deleted", instead of removing it from the system, the deleted flag is set to true. This gives us a property to omit it in the future.

### Deleting Properties

You can delete properties from CoMaps:

```ts
inventory.$jazz.delete("basil"); // Remove a key-value pair

// For optional fields in struct-like CoMaps
project.$jazz.set("coordinator", undefined); // Remove the reference

```

## Running migrations on CoMaps

Migrations are functions that run when a CoMap is loaded, allowing you to update existing data to match new schema versions. Use them when you need to modify the structure of CoMaps that already exist in your app. Unlike [Account migrations](/docs/core-concepts/schemas/accounts-and-migrations#when-migrations-run), CoMap migrations are not run when a CoMap is created.

**Note:** Migrations are run synchronously and cannot be run asynchronously.

Here's an example of a migration that adds the `priority` field to the `Task` CoMap:

```ts
const Task = co
  .map({
    done: z.boolean(),
    text: co.plainText(),
    version: z.literal([1, 2]),
    priority: z.enum(["low", "medium", "high"]), // new field
  })
  .withMigration((task) => {
    if (task.version === 1) {
      task.$jazz.set("priority", "medium");
      // Upgrade the version so the migration won't run again
      task.$jazz.set("version", 2);
    }
  });

```

### Migration best practices

Design your schema changes to be compatible with existing data:

* **Add, don't change:** Only add new fields; avoid renaming or changing types of existing fields
* **Make new fields optional:** This prevents errors when loading older data
* **Use version fields:** Track schema versions to run migrations only when needed

### Migration & reader permissions

Migrations need write access to modify CoMaps. If some users only have read permissions, they can't run migrations on those CoMaps.

**Forward-compatible schemas** (where new fields are optional) handle this gracefully - users can still use the app even if migrations haven't run.

**Non-compatible changes** require handling both schema versions in your app code using discriminated unions.

When you can't guarantee all users can run migrations, handle multiple schema versions explicitly:

```ts
const TaskV1 = co.map({
  version: z.literal(1),
  done: z.boolean(),
  text: z.string(),
});

const TaskV2 = co
  .map({
    // We need to be more strict about the version to make the
    // discriminated union work
    version: z.literal(2),
    done: z.boolean(),
    text: z.string(),
    priority: z.enum(["low", "medium", "high"]),
  })
  .withMigration((task) => {
    if (task.version === 1) {
      task.$jazz.set("version", 2);
      task.$jazz.set("priority", "medium");
    }
  });

// Export the discriminated union; because some users might
// not be able to run the migration
export const Task = co.discriminatedUnion("version", [TaskV1, TaskV2]);
export type Task = co.loaded<typeof Task>;

```

## Best Practices

### Structuring Data

* Use struct-like CoMaps for entities with fixed, known properties
* Use record-like CoMaps for dynamic key-value collections
* Group related properties into nested CoMaps for better organization

### Common Patterns

#### Helper methods

You should define helper methods of CoValue schemas separately, in standalone functions:

```ts
import { co, z } from "jazz-tools";

const Project = co.map({
  name: z.string(),
  startDate: z.date(),
  endDate: z.optional(z.date()),
});
type Project = co.loaded<typeof Project>;

export function isProjectActive(project: Project) {
  const now = new Date();
  return (
    now >= project.startDate && (!project.endDate || now <= project.endDate)
  );
}

export function formatProjectDuration(
  project: Project,
  format: "short" | "full",
) {
  const start = project.startDate.toLocaleDateString();
  if (!project.endDate) {
    return format === "full" ? `Started on ${start}, ongoing` : `From ${start}`;
  }

  const end = project.endDate.toLocaleDateString();
  return format === "full"
    ? `From ${start} to ${end}`
    : `${(project.endDate.getTime() - project.startDate.getTime()) / 86400000} days`;
}

const project = Project.create({
  name: "My project",
  startDate: new Date("2025-04-01"),
  endDate: new Date("2025-04-04"),
});

console.log(isProjectActive(project)); // false
console.log(formatProjectDuration(project, "short")); // "3 days"

```

#### Uniqueness

CoMaps are typically created with a CoValue ID that acts as an opaque UUID, by which you can then load them. However, there are situations where it is preferable to load CoMaps using a custom identifier:

* The CoMaps have user-generated identifiers, such as a slug
* The CoMaps have identifiers referring to equivalent data in an external system
* The CoMaps have human-readable & application-specific identifiers  
   * If an application has CoValues used by every user, referring to it by a unique _well-known_ name (eg, `"my-global-comap"`) can be more convenient than using a CoValue ID

Consider a scenario where one wants to identify a CoMap using some unique identifier that isn't the Jazz CoValue ID:

```ts
// This will not work as `learning-jazz` is not a CoValue ID
const myTask = await Task.load("learning-jazz");

```

To make it possible to use human-readable identifiers Jazz lets you to define a `unique` property on CoMaps.

Then the CoValue ID is deterministically derived from the `unique` property and the owner of the CoMap.

```ts
// Given the project owner, myTask will have always the same id
Task.create(
  {
    text: "Let's learn some Jazz!",
  },
  {
    unique: "learning-jazz",
    owner: project.$jazz.owner, // Different owner, different id
  },
);

```

Now you can use `CoMap.loadUnique` to easily load the CoMap using the human-readable identifier:

```ts
const learnJazzTask = await Task.loadUnique(
  "learning-jazz",
  project.$jazz.owner.$jazz.id,
);

```

It's also possible to combine the create+load operation using `CoMap.upsertUnique`:

```ts
await Task.upsertUnique({
  value: {
    text: "Let's learn some Jazz!",
  },
  unique: "learning-jazz",
  owner: project.$jazz.owner,
});

```

**Caveats:**

* The `unique` parameter acts as an _immutable_ identifier - i.e. the same `unique` parameter in the same `Group` will always refer to the same CoValue.  
   * To make dynamic renaming possible, you can create an indirection where a stable CoMap identified by a specific value of `unique` is simply a pointer to another CoMap with a normal, dynamic CoValue ID. This pointer can then be updated as desired by users with the corresponding permissions.
* This way of introducing identifiers allows for very fast lookup of individual CoMaps by identifier, but it doesn't let you enumerate all the CoMaps identified this way within a `Group`. If you also need enumeration, consider using a global `co.record()` that maps from identifier to a CoMap, which you then do lookups in (this requires at least a shallow load of the entire `co.record()`, but this should be fast for up to 10s of 1000s of entries)

#### Creating Set-like Collections

You can use CoRecords as a way to create set-like collections, by keying the CoRecord on the item's CoValue ID. You can then use static `Object` methods to iterate over the CoRecord, effectively allowing you to treat it as a set.

```ts
const Chat = co.map({
messages: co.list(Message),
participants: co.record(z.string(), MyAppUser),
});

const chat = await Chat.load(chatId, {
resolve: {
  participants: true,
},
});

let participantList: string[];

// Note that I don't need to load the map deeply to read and set keys
if (chat.$isLoaded) {
chat.participants.$jazz.set(me.$jazz.id, me);
participantList = Object.keys(chat.participants);
}

```

You can choose a loading strategy for the CoRecord. Use $each when you need all item properties to be immediately available. In general, it is enough to shallowly load a CoRecord to access its keys, and then load the values of those keys as needed (for example, by passing the keys as strings to a child component).

```ts
const { participants } = await chat.$jazz.ensureLoaded({
resolve: {
  participants: {
    $each: {
      profile: {
        avatar: true,
      },
    },
  },
},
});

const avatarList = Object.values(participants).map(
(user) => user.profile.avatar,
);

```


### CoLists
# CoLists

CoLists are ordered collections that work like JavaScript arrays. They provide indexed access, iteration methods, and length properties, making them perfect for managing sequences of items.

## Creating CoLists

CoLists are defined by specifying the type of items they contain:

```ts
import { co, z } from "jazz-tools";

const ListOfResources = co.list(z.string());
export type ListOfResources = co.loaded<typeof ListOfResources>;

const ListOfTasks = co.list(Task);
export type ListOfTasks = co.loaded<typeof ListOfTasks>;
export type ListOfTasksInitShape = co.input<typeof ListOfTasks>; // type accepted by `ListOfTasks.create`

```

To create a `CoList`:

```ts
// Create an empty list
const resources = co.list(z.string()).create([]);

// Create a list with initial items
const tasks = co.list(Task).create([
  { title: "Prepare soil beds", status: "in-progress" },
  { title: "Order compost", status: "todo" },
]);

```

### Ownership

Like other CoValues, you can specify ownership when creating CoLists.

```ts
// Create with shared ownership
const teamGroup = Group.create();
teamGroup.addMember(colleagueAccount, "writer");

const teamList = co.list(Task).create([], { owner: teamGroup });

```

See [Groups as permission scopes](/docs/permissions-and-sharing/overview) for more information on how to use groups to control access to CoLists.

## Reading from CoLists

CoLists support standard array access patterns:

```ts
// Access by index
const firstTask = tasks[0];
console.log(firstTask.title); // "Prepare soil beds"

// Get list length
console.log(tasks.length); // 2

// Iteration
tasks.forEach((task) => {
  console.log(task.title);
  // "Prepare soil beds"
  // "Order compost"
});

// Array methods
const todoTasks = tasks.filter((task) => task.status === "todo");
console.log(todoTasks.length); // 1

```

## Updating CoLists

Methods to update a CoList's items are grouped inside the `$jazz` namespace:

```ts
// Add items
resources.$jazz.push("Tomatoes"); // Add to end
resources.$jazz.unshift("Lettuce"); // Add to beginning
tasks.$jazz.push({
  // Add complex items
  title: "Install irrigation", // (Jazz will create
  status: "todo", // the CoValue for you!)
});

// Replace items
resources.$jazz.set(0, "Cucumber"); // Replace by index

// Modify nested items
tasks[0].$jazz.set("status", "complete"); // Update properties of references

```

### Soft Deletion

You can do a soft deletion by using a deleted flag, then creating a helper method that explicitly filters out items where the deleted property is true.

```ts
const Task = co.map({
  title: z.string(),
  status: z.literal(["todo", "in-progress", "complete"]),
  deleted: z.optional(z.boolean()), // [!code ++]
});
type Task = typeof Task;

const ListOfTasks = co.list(Task);
type ListOfTasks = typeof ListOfTasks;

export function getCurrentTasks(list: co.loaded<ListOfTasks, { $each: true }>) {
  return list.filter((task): task is co.loaded<Task> => !task.deleted);
}

async function main() {
  const myTaskList = ListOfTasks.create([]);
  myTaskList.$jazz.push({
    title: "Tomatoes",
    status: "todo",
    deleted: false,
  });
  myTaskList.$jazz.push({
    title: "Cucumbers",
    status: "todo",
    deleted: true,
  });
  myTaskList.$jazz.push({
    title: "Carrots",
    status: "todo",
  });

  const activeTasks = getCurrentTasks(myTaskList);
  console.log(activeTasks.map((task) => task.title));
  // Output: ["Tomatoes", "Carrots"]
}

```

There are several benefits to soft deletions:

* **recoverablity** \- Nothing is truly deleted, so recovery is possible in the future
* **data integrity** \- Relationships can be maintained between current and deleted values
* **auditable** \- The data can still be accessed, good for audit trails and checking compliance

### Deleting Items

Jazz provides two methods to retain or remove items from a CoList:

```ts
// Remove items
resources.$jazz.remove(2); // By index
console.log(resources); // ["Cucumber", "Peppers"]
resources.$jazz.remove((item) => item === "Cucumber"); // Or by predicate
console.log(resources); // ["Tomatoes", "Peppers"]

// Keep only items matching the predicate
resources.$jazz.retain((item) => item !== "Cucumber");
console.log(resources); // ["Tomatoes", "Peppers"]

```

You can also remove specific items by index with `splice`, or remove the first or last item with `pop` or `shift`:

```ts
// Remove 2 items starting at index 1
resources.$jazz.splice(1, 2);
console.log(resources); // ["Tomatoes"]

// Remove a single item at index 0
resources.$jazz.splice(0, 1);
console.log(resources); // ["Cucumber", "Peppers"]

// Remove items
const lastItem = resources.$jazz.pop(); // Remove and return last item
resources.$jazz.shift(); // Remove first item

```

### Array Methods

`CoList`s support the standard JavaScript array methods you already know. Methods that mutate the array are grouped inside the `$jazz` namespace.

```ts
// Add multiple items at once
resources.$jazz.push("Tomatoes", "Basil", "Peppers");

// Find items
const basil = resources.find((r) => r === "Basil");

// Filter (returns regular array, not a CoList)
const tItems = resources.filter((r) => r.startsWith("T"));
console.log(tItems); // ["Tomatoes"]

```

### Type Safety

CoLists maintain type safety for their items:

```ts
// TypeScript catches type errors
resources.$jazz.push("Carrots"); // ✓ Valid string
// [!code --]
resources.$jazz.push(42); // ✗ Type error: expected string
// [!code --]
// Argument of type 'number' is not assignable to parameter of type 'string'
// For lists of references
tasks.forEach((task) => {
  console.log(task.title); // TypeScript knows task has title
});

```

## Best Practices

### Common Patterns

#### List Rendering

CoLists work well with UI rendering libraries:

```ts
import { co, z } from "jazz-tools";
const ListOfTasks = co.list(Task);

// React example
function TaskList({ tasks }: { tasks: co.loaded<typeof ListOfTasks> }) {
  return (
    <ul>
      {tasks.map((task) =>
        task.$isLoaded ? (
          <li key={task.$jazz.id}>
            {task.title} - {task.status}
          </li>
        ) : null,
      )}
    </ul>
  );
}

```

#### Managing Relations

CoLists can be used to create one-to-many relationships:

```ts
import { co, z } from "jazz-tools";

const Task = co.map({
  title: z.string(),
  status: z.literal(["todo", "in-progress", "complete"]),

  get project(): co.Optional<typeof Project> {
    return co.optional(Project);
  },
});

const ListOfTasks = co.list(Task);

const Project = co.map({
  name: z.string(),

  get tasks(): co.List<typeof Task> {
    return ListOfTasks;
  },
});

const project = Project.create({
  name: "Garden Project",
  tasks: ListOfTasks.create([]),
});

const task = Task.create({
  title: "Plant seedlings",
  status: "todo",
  project: project, // Add a reference to the project
});

// Add a task to a garden project
project.tasks.$jazz.push(task);

// Access the project from the task
console.log(task.project); // { name: "Garden Project", tasks: [task] }

```

#### Set-like Collections

CoLists, like JavaScript arrays, allow you to insert the same item multiple times. In some cases, you might want to have a collection of unique items (similar to a set). To achieve this, you can use a CoRecord with entries keyed on a unique identifier (for example, the CoValue ID).

You can read [more about this pattern here](/docs/core-concepts/covalues/comaps#creating-set-like-collections).


### CoFeeds
# CoFeeds

CoFeeds are append-only data structures that track entries from different user sessions and accounts. Unlike other CoValues where everyone edits the same data, CoFeeds maintain separate streams for each session.

Each account can have multiple sessions (different browser tabs, devices, or app instances), making CoFeeds ideal for building features like activity logs, presence indicators, and notification systems.

The following examples demonstrate a practical use of CoFeeds:

* [Multi-cursors](https://github.com/garden-co/jazz/tree/main/examples/multi-cursors) \- track user presence on a canvas with multiple cursors and out of bounds indicators
* [Reactions](https://github.com/garden-co/jazz/tree/main/examples/reactions) \- store per-user emoji reaction using a CoFeed

## Creating CoFeeds

CoFeeds are defined by specifying the type of items they'll contain, similar to how you define CoLists:

```ts
// Define a schema for feed items
const Activity = co.map({
  timestamp: z.date(),
  action: z.literal(["watering", "planting", "harvesting", "maintenance"]),
  notes: z.optional(z.string()),
});
export type Activity = co.loaded<typeof Activity>;

// Define a feed of garden activities
const ActivityFeed = co.feed(Activity);

// Create a feed instance
const activityFeed = ActivityFeed.create([]);

```

### Ownership

Like other CoValues, you can specify ownership when creating CoFeeds.

```ts
const teamGroup = Group.create();
teamGroup.addMember(colleagueAccount, "writer");
const teamFeed = ActivityFeed.create([], { owner: teamGroup });

```

See [Groups as permission scopes](/docs/permissions-and-sharing/overview) for more information on how to use groups to control access to CoFeeds.

## Reading from CoFeeds

Since CoFeeds are made of entries from users over multiple sessions, you can access entries in different ways - from a specific user's session or from their account as a whole.

### Per-Session Access

To retrieve entries from a session:

```ts
// Get the feed for a specific session
const sessionFeed = activityFeed.perSession[sessionId];

// Latest entry from a session
if (sessionFeed?.value.$isLoaded) {
  console.log(sessionFeed.value.action); // "watering"
}

```

For convenience, you can also access the latest entry from the current session with `inCurrentSession`:

```ts
// Get the feed for the current session
const currentSessionFeed = activityFeed.inCurrentSession;

// Latest entry from the current session
if (currentSessionFeed?.value.$isLoaded) {
  console.log(currentSessionFeed.value.action); // "harvesting"
}

```

### Per-Account Access

To retrieve entries from a specific account (with entries from all sessions combined) use `perAccount`:

```ts
// Get the feed for a specific session
const accountFeed = activityFeed.perAccount[accountId];

// Latest entry from an account
if (accountFeed?.value.$isLoaded) {
  console.log(accountFeed.value.action); // "watering"
}

```

For convenience, you can also access the latest entry from the current account with `byMe`:

```ts
// Get the feed for the current account
const myLatestEntry = activityFeed.byMe;

// Latest entry from the current account
if (myLatestEntry?.value.$isLoaded) {
  console.log(myLatestEntry.value.action); // "harvesting"
}

```

### Feed Entries

#### All Entries

To retrieve all entries from a CoFeed:

```ts
// Get the feeds for a specific account and session
const accountFeed = activityFeed.perAccount[accountId];
const sessionFeed = activityFeed.perSession[sessionId];

// Iterate over all entries from the account
for (const entry of accountFeed.all) {
  if (entry.value.$isLoaded) {
    console.log(entry.value);
  }
}

// Iterate over all entries from the session
for (const entry of sessionFeed.all) {
  if (entry.value.$isLoaded) {
    console.log(entry.value);
  }
}

```

#### Latest Entry

To retrieve the latest entry from a CoFeed, ie. the last update:

```ts
// Get the latest entry from the current account
const latestEntry = activityFeed.byMe;

if (latestEntry?.value.$isLoaded) {
  console.log(`My last action was ${latestEntry?.value?.action}`);
  // "My last action was harvesting"
}

// Get the latest entry from each account
const latestEntriesByAccount = Object.values(activityFeed.perAccount).map(
  (entry) => ({
    accountName: entry.by?.profile.$isLoaded ? entry.by.profile.name : "Unknown",
    value: entry.value,
  }),
);

```

## Writing to CoFeeds

CoFeeds are append-only; you can add new items, but not modify existing ones. This creates a chronological record of events or activities.

### Adding Items

```ts
// Log a new activity
activityFeed.$jazz.push(
  Activity.create({
    timestamp: new Date(),
    action: "watering",
    notes: "Extra water for new seedlings",
  }),
);

```

Each item is automatically associated with the current user's session. You don't need to specify which session the item belongs to - Jazz handles this automatically.

### Understanding Session Context

Each entry is automatically added to the current session's feed. When a user has multiple open sessions (like both a mobile app and web browser), each session creates its own separate entries:

```ts
// On mobile device:
fromMobileFeed.$jazz.push(
  Activity.create({
    timestamp: new Date(),
    action: "harvesting",
    notes: "Vegetable patch",
  }),
);

// On web browser (same user):
fromBrowserFeed.$jazz.push(
  Activity.create({
    timestamp: new Date(),
    action: "planting",
    notes: "Flower bed",
  }),
);

// These are separate entries in the same feed, from the same account

```

## Metadata

CoFeeds support metadata, which is useful for tracking information about the feed itself.

### By

The `by` property is the account that made the entry.

```ts
Me
// Get the feed for the current account
const myLatestEntry = activityFeed.byMe;

// Latest entry from the current account
if (myLatestEntry?.value.$isLoaded) {
  console.log(myLatestEntry.value.action); // "harvesting"
}

```

### MadeAt

The `madeAt` property is a timestamp of when the entry was added to the feed.

```ts
const accountFeed = activityFeed.perAccount[accountId];

// Get the timestamp of the last update
console.log(accountFeed?.madeAt);

// Get the timestamp of each entry
for (const entry of accountFeed.all) {
  console.log(entry.madeAt);
}

```

## Best Practices

### When to Use CoFeeds

* **Use CoFeeds when**:  
   * You need to track per-user/per-session data  
   * Time-based information matters (activity logs, presence)
* **Consider alternatives when**:  
   * Data needs to be collaboratively edited (use CoMaps or CoLists)  
   * You need structured relationships (use CoMaps/CoLists with references)


### CoTexts
# CoTexts

Jazz provides two CoValue types for collaborative text editing, collectively referred to as "CoText" values:

* **`co.plainText()`** for simple text editing without formatting
* **`co.richText()`** for rich text with HTML-based formatting (extends `co.plainText()`)

Both types enable real-time collaborative editing of text content while maintaining consistency across multiple users.

**Note:** If you're looking for a quick way to add rich text editing to your app, check out [our prosemirror plugin](#using-rich-text-with-prosemirror).

```ts
const note = co.plainText().create("Meeting notes");

// Update the text
note.$jazz.applyDiff("Meeting notes for Tuesday");

console.log(note.toString()); // "Meeting notes for Tuesday"

```

For a full example of CoTexts in action, see [our Richtext example app](https://github.com/garden-co/jazz/tree/main/examples/richtext-prosemirror), which shows plain text and rich text editing.

## `co.plainText()` vs `z.string()`

While `z.string()` is perfect for simple text fields, `co.plainText()` is the right choice when you need:

* Frequent text edits that aren't just replacing the whole field
* Fine-grained control over text edits (inserting, deleting at specific positions)
* Multiple users editing the same text simultaneously
* Character-by-character collaboration
* Efficient merging of concurrent changes

Both support real-time updates, but `co.plainText()` provides specialized tools for collaborative editing scenarios.

## Creating CoText Values

CoText values are typically used as fields in your schemas:

```ts
const Profile = co.profile({
  name: z.string(),
  bio: co.plainText(), // Plain text field
  description: co.richText(), // Rich text with formatting
});

```

Create a CoText value with a simple string:

```ts
// Create plaintext with default ownership (current user)
const meetingNotes = co.plainText().create("Meeting notes");

// Create rich text with HTML content
const document = co
  .richText()
  .create("<p>Project <strong>overview</strong></p>");

```

### Ownership

Like other CoValues, you can specify ownership when creating CoTexts.

```ts
// Create with shared ownership
const teamGroup = Group.create();
teamGroup.addMember(colleagueAccount, "writer");

const teamNote = co.plainText().create("Team updates", { owner: teamGroup });

```

See [Groups as permission scopes](/docs/permissions-and-sharing/overview) for more information on how to use groups to control access to CoText values.

## Reading Text

CoText values work similarly to JavaScript strings:

```ts
// Get the text content
console.log(note.toString()); // "Meeting notes"
console.log(`${note}`); // "Meeting notes"

// Check the text length
console.log(note.length); // 14

```

## Making Edits

Insert and delete text with intuitive methods:

```ts
// Insert text at a specific position
note.insertBefore(8, "weekly "); // "Meeting weekly notes"

// Insert after a position
note.insertAfter(21, " for Monday"); // "Meeting weekly notes for Monday"

// Delete a range of text
note.deleteRange({ from: 8, to: 15 }); // "Meeting notes for Monday"

// Apply a diff to update the entire text
note.$jazz.applyDiff("Team meeting notes for Tuesday");

```

### Applying Diffs

Use `applyDiff` to efficiently update text with minimal changes:

```ts
// Original text: "Team status update"
const minutes = co.plainText().create("Team status update");

// Replace the entire text with a new version
minutes.$jazz.applyDiff("Weekly team status update for Project X");

// Make partial changes
let text = minutes.toString();
text = text.replace("Weekly", "Monday");
minutes.$jazz.applyDiff(text); // Efficiently updates only what changed

```

Perfect for handling user input in form controls:

```ts
const note = co.plainText().create("");

// Create and set up the textarea
const textarea = document.createElement("textarea");
textarea.value = note.toString();

// Add event listener for changes
textarea.addEventListener("input", (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  // Efficiently update only what the user changed
  note.$jazz.applyDiff(target.value);
});

// Add the textarea to the document
document.body.appendChild(textarea);

```

## Using Rich Text with ProseMirror

Jazz provides a dedicated plugin for integrating `co.richText()` with the popular ProseMirror editor that enables bidirectional synchronization between your co.richText() instances and ProseMirror editors.

### ProseMirror Plugin Features

* **Bidirectional Sync**: Changes in the editor automatically update the `co.richText()` and vice versa
* **Real-time Collaboration**: Multiple users can edit the same document simultaneously
* **HTML Conversion**: Automatically converts between HTML (used by `co.richText()`) and ProseMirror's document model

### Installation

```bash
pnpm add prosemirror-view \
  prosemirror-state \
  prosemirror-schema-basic

```

### Integration

For use without a framework:

```ts
function setupRichTextEditor(
  coRichText: CoRichText,
  container: HTMLDivElement,
) {
  // Create the Jazz plugin for ProseMirror
  // Providing a co.richText() instance to the plugin to automatically sync changes
  const jazzPlugin = createJazzPlugin(coRichText); // [!code ++]

  // Set up ProseMirror with Jazz plugin
  const view = new EditorView(container, {
    state: EditorState.create({
      schema,
      plugins: [
        ...exampleSetup({ schema }),
        jazzPlugin, // [!code ++]
      ],
    }),
  });

  // Return cleanup function
  return () => {
    view.destroy();
  };
}

// Usage
const doc = co.richText().create("<p>Initial content</p>");
const editorContainer = document.getElementById("editor") as HTMLDivElement;
const cleanup = setupRichTextEditor(doc, editorContainer);

// Later when done with the editor
cleanup();

```


### FileStreams
# FileStreams

FileStreams handle binary data in Jazz applications - think documents, audio files, and other non-text content. They're essentially collaborative versions of `Blob`s that sync automatically across devices.

Use FileStreams when you need to:

* Distribute documents across devices
* Store audio or video files
* Sync any binary data between users

**Note:** For images specifically, Jazz provides the higher-level `ImageDefinition` abstraction which manages multiple image resolutions - see the [ImageDefinition documentation](/docs/core-concepts/covalues/imagedef) for details.

FileStreams provide automatic chunking when using the `createFromBlob` method, track upload progress, and handle MIME types and metadata.

In your schema, reference FileStreams like any other CoValue:

**File name: schema.ts**

```ts
import { co, z } from "jazz-tools";

const Document = co.map({
  title: z.string(),
  file: co.fileStream(), // Store a document file
});

```

## Creating FileStreams

There are two main ways to create FileStreams: creating empty ones for manual data population or creating directly from existing files or blobs.

### Creating from Blobs and Files

For files from input elements or drag-and-drop interfaces, use `createFromBlob`:

```ts
// From a file input
const fileInput = document.querySelector(
  'input[type="file"]',
) as HTMLInputElement;

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  // Create FileStream from user-selected file
  const fileStream = await co
    .fileStream()
    .createFromBlob(file, { owner: myGroup });

  // Or with progress tracking for better UX
  const fileWithProgress = await co.fileStream().createFromBlob(file, {
    onProgress: (progress) => {
      // progress is a value between 0 and 1
      const percent = Math.round(progress * 100);
      console.log(`Upload progress: ${percent}%`);
      progressBar.style.width = `${percent}%`;
    },
    owner: myGroup,
  });
});

```

### Creating Empty FileStreams

Create an empty FileStream when you want to manually [add binary data in chunks](#writing-to-filestreams):

```ts
const fileStream = co.fileStream().create({ owner: myGroup });

```

### Ownership

Like other CoValues, you can specify ownership when creating FileStreams.

```ts
// Create a team group
const teamGroup = Group.create();
teamGroup.addMember(colleagueAccount, "writer");

// Create a FileStream with shared ownership
const teamFileStream = co.fileStream().create({ owner: teamGroup });

```

See [Groups as permission scopes](/docs/permissions-and-sharing/overview) for more information on how to use groups to control access to FileStreams.

## Reading from FileStreams

`FileStream`s provide several ways to access their binary content, from raw chunks to convenient Blob objects.

### Getting Raw Data Chunks

To access the raw binary data and metadata:

```ts
// Get all chunks and metadata
const fileData = fileStream.getChunks();

if (fileData) {
  console.log(`MIME type: ${fileData.mimeType}`);
  console.log(`Total size: ${fileData.totalSizeBytes} bytes`);
  console.log(`File name: ${fileData.fileName}`);
  console.log(`Is complete: ${fileData.finished}`);

  // Access raw binary chunks
  for (const chunk of fileData.chunks) {
    // Each chunk is a Uint8Array
    console.log(`Chunk size: ${chunk.length} bytes`);
  }
}

```

By default, `getChunks()` only returns data for completely synced `FileStream`s. To start using chunks from a `FileStream` that's currently still being synced use the `allowUnfinished` option:

```ts
// Get data even if the stream isn't complete
const partialData = fileStream.getChunks({ allowUnfinished: true });

```

### Converting to Blobs

For easier integration with web APIs, convert to a `Blob`:

```ts
// Convert to a Blob
const blob = fileStream.toBlob();

// Get the filename from the metadata
const filename = fileStream.getChunks()?.fileName;

if (blob) {
  // Use with URL.createObjectURL
  const url = URL.createObjectURL(blob);

  // Create a download link
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "document.pdf";
  link.click();

  // Clean up when done
  URL.revokeObjectURL(url);
}

```

### Loading FileStreams as Blobs

You can directly load a `FileStream` as a `Blob` when you only have its ID:

```ts
// Load directly as a Blob when you have an ID
const blobFromID = await co.fileStream().loadAsBlob(fileStreamId);

// By default, waits for complete uploads
// For in-progress uploads:
const partialBlob = await co.fileStream().loadAsBlob(fileStreamId, {
  allowUnfinished: true,
});

```

### Checking Completion Status

Check if a `FileStream` is fully synced:

```ts
if (fileStream.isBinaryStreamEnded()) {
  console.log("File is completely synced");
} else {
  console.log("File upload is still in progress");
}

```

## Writing to FileStreams

When creating a `FileStream` manually (not using `createFromBlob`), you need to manage the upload process yourself. This gives you more control over chunking and progress tracking.

### The Upload Lifecycle

`FileStream` uploads follow a three-stage process:

1. **Start** \- Initialize with metadata
2. **Push** \- Send one or more chunks of data
3. **End** \- Mark the stream as complete

### Starting a `FileStream`

Begin by providing metadata about the file:

```ts
// Create an empty FileStream
const manualFileStream = co.fileStream().create({ owner: myGroup });

// Initialize with metadata
manualFileStream.start({
  mimeType: "application/pdf", // MIME type (required)
  totalSizeBytes: 1024 * 1024 * 2, // Size in bytes (if known)
  fileName: "document.pdf", // Original filename (optional)
});

```

### Pushing Data

Add binary data in chunks - this helps with large files and progress tracking:

```ts
const data = new Uint8Array(arrayBuffer);

// For large files, break into chunks (e.g., 100KB each)
const chunkSize = 1024 * 100;
for (let i = 0; i < data.length; i += chunkSize) {
  // Create a slice of the data
  const chunk = data.slice(i, i + chunkSize);

  // Push chunk to the FileStream
  fileStream.push(chunk);

  // Track progress
  const progress = Math.min(
    100,
    Math.round(((i + chunk.length) * 100) / data.length),
  );
  console.log(`Upload progress: ${progress}%`);
}

// Finalise the upload
fileStream.end();

console.log("Upload complete!");

```

### Completing the Upload

Once all chunks are pushed, mark the `FileStream` as complete:

```ts
// Finalise the upload
fileStream.end();

console.log("Upload complete!");

```

## Subscribing to `FileStream`s

Like other CoValues, you can subscribe to `FileStream`s to get notified of changes as they happen. This is especially useful for tracking upload progress when someone else is uploading a file.

### Loading by ID

Load a `FileStream` when you have its ID:

```ts
const fileStreamFromId = await co.fileStream().load(fileStreamId);

if (fileStream.$isLoaded) {
  console.log("FileStream loaded successfully");

  // Check if it's complete
  if (fileStream.isBinaryStreamEnded()) {
    // Process the completed file
    const blob = fileStream.toBlob();
  }
}

```

### Subscribing to Changes

Subscribe to a `FileStream` to be notified when chunks are added or when the upload is complete:

```ts
const unsubscribe = co
  .fileStream()
  .subscribe(fileStreamId, (fileStream: FileStream) => {
    // Called whenever the FileStream changes
    console.log("FileStream updated");

    // Get current status
    const chunks = fileStream.getChunks({ allowUnfinished: true });
    if (chunks) {
      const uploadedBytes = chunks.chunks.reduce(
        (sum: number, chunk: Uint8Array) => sum + chunk.length,
        0,
      );
      const totalBytes = chunks.totalSizeBytes || 1;
      const progress = Math.min(
        100,
        Math.round((uploadedBytes * 100) / totalBytes),
      );

      console.log(`Upload progress: ${progress}%`);

      if (fileStream.isBinaryStreamEnded()) {
        console.log("Upload complete!");
        // Now safe to use the file
        const blob = fileStream.toBlob();

        // Clean up the subscription if we're done
        unsubscribe();
      }
    }
  });

```

### Waiting for Upload Completion

If you need to wait for a `FileStream` to be fully synchronized across devices:

```ts
// Wait for the FileStream to be fully synced
await fileStream.$jazz.waitForSync({
  timeout: 5000, // Optional timeout in ms
});

console.log("FileStream is now synced to all connected devices");

```

This is useful when you need to ensure that a file is available to other users before proceeding with an operation.


### CoVectors
# CoVectors

CoVectors let you store and query high‑dimensional vectors directly in Jazz apps. They are ideal for semantic search, or personalization features that work offline, sync across devices, and remain end‑to‑end encrypted.

The [Journal example](https://github.com/garden-co/jazz/tree/main/examples/vector-search) demonstrates semantic search using of CoVector.

CoVectors are defined using `co.vector()`, and are often used as fields in a CoMap within a CoList (making it easy to perform vector search across list items).

```ts
import { co, z } from "jazz-tools";

const Embedding = co.vector(384); // Define 384-dimensional embedding

const Document = co.map({
  content: z.string(),
  embedding: Embedding,
});

export const DocumentsList = co.list(Document);

```

The number of dimensions matches the embedding model used in your app. Many small sentence transformers produce 384‑dim vectors; others use 512, 768, 1024 or more.

## Creating CoVectors

You can create vectors in your Jazz application from an array of numbers, or Float32Array instance.

```ts
// Generate embeddings (bring your own embeddings model)
const vectorData = await createEmbedding("Text");

const newDocument = Document.create({
content: "Text",
embedding: Embedding.create(vectorData),
});

documents.$jazz.push(newDocument);

```

### Ownership

Like other CoValues, you can specify ownership when creating CoVectors.

```ts
// Create with shared ownership
const teamGroup = Group.create();
teamGroup.addMember(colleagueAccount, "writer");

const teamList = co.vector(384).create(vector, { owner: teamGroup });

```

See [Groups as permission scopes](/docs/permissions-and-sharing/overview) for more information on how to use groups to control access to CoVectors.

### Immutability

CoVectors cannot be changed after creation. Instead, create a new CoVector with the updated values and replace the previous one.

## Semantic Search

Semantic search lets you find data based on meaning, not just keywords. In Jazz, you can easily sort results by how similar they are to your search query.

You can load your data using the `.load` method, then compute and sort the results by similarity to your query embedding:

```ts
// // 1) Load your documents
const allDocuments = await DocumentsList.load(documentsListId, {
  resolve: {
    $each: { embedding: true },
  },
});

// 2) Obtain vector for your search query
const queryEmbedding = await createEmbedding("search query");

// 3) Sort documents by vector similarity
const similarDocuments = documents.$isLoaded ? documents.map((value) => ({
  value,
  similarity: value.embedding.$jazz.cosineSimilarity(queryEmbedding), // [!code ++]
}))
  .sort((a, b) => b.similarity - a.similarity)
  .filter((result) => result.similarity > 0.5) : null;

```

Wrapping each item with its similarity score makes it easy to sort, filter, and display the most relevant results. This approach is widely used in vector search and recommendation systems, since it keeps both the data and its relevance together for further processing or display.

### Cosine Similarity

To compare how similar two vectors are, we use their [cosine similarity](https://en.wikipedia.org/wiki/Cosine%5Fsimilarity). This returns a value between `-1` and `1`, describing how similar the vectors are:

* `1` means the vectors are identical
* `0` means the vectors are orthogonal (i.e. no similarity)
* `-1` means the vectors are opposite direction (perfectly dissimilar).

If you sort items by their cosine similarity, the ones which are most similar will appear at the top of the list.

Jazz provides a built-in `$jazz.cosineSimilarity` method to calculate this for you.

## Embedding Models

CoVectors handles storage and search, you provide the vectors. Generate embeddings with any model you prefer (Hugging Face, OpenAI, custom, etc).

**Recommended:** Run models locally for privacy and offline support using [Transformers.js](https://huggingface.co/docs/transformers.js). Check our [Journal app example](https://github.com/garden-co/jazz/tree/main/examples/vector-search) to see how to do this.

The following models offer a good balance between accuracy and performance:

* [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2) — 384 dimensions, \~23 MB
* [Xenova/paraphrase-multilingual-mpnet-base-v2](https://huggingface.co/Xenova/paraphrase-multilingual-mpnet-base-v2) — 768 dimensions, \~279 MB
* [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) — 1024 dimensions, \~337 MB
* [Browse more models →](https://huggingface.co/models?pipeline%5Ftag=feature-extraction&library=transformers.js)

Alternatively, you can generate embeddings using server-side or commercial APIs (such as OpenAI or Anthropic).

## Best Practices

### Changing embedding models

**Always use the same embedding model for all vectors you intend to compare.**Mixing vectors from different models (or even different versions of the same model) will result in meaningless similarity scores, as the vector spaces are not compatible.

If you need to switch models, consider storing the model identifier alongside each vector, and re-embedding your data as needed.


### ImageDefinitions
# ImageDefinition

`ImageDefinition` is a specialized CoValue designed specifically for managing images in Jazz applications. It extends beyond basic file storage by supporting a blurry placeholder, built-in resizing, and progressive loading patterns.

Beyond `ImageDefinition`, Jazz offers higher-level functions and components that make it easier to use images:

* [createImage()](#creating-images) \- function to create an `ImageDefinition` from a file
* [loadImage, loadImageBySize, highestResAvailable](#displaying-images) \- functions to load and display images

## Creating Images

The easiest way to create and use images in your Jazz application is with the `createImage()` function:

```ts
import { createImage } from "jazz-tools/media";

// Create an image from a file input
async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0];
  if (file && me.profile.$isLoaded) {
    // Creates ImageDefinition with a blurry placeholder, limited to 1024px on the longest side, and multiple resolutions automatically
    const image = await createImage(file, {
      owner: me.$jazz.owner,
      maxSize: 1024,
      placeholder: "blur",
      progressive: true,
    });

    // Store the image in your application data
    me.profile.$jazz.set("image", image);
  }
}

```

The `createImage()` function:

* Creates an `ImageDefinition` with the right properties
* Optionally generates a small placeholder for immediate display
* Creates multiple resolution variants of your image
* Returns the created `ImageDefinition`

### Configuration Options

```ts
declare function createImage(
  image: Blob | File | string,
  options?: {
    owner?: Group | Account;
    placeholder?: false | "blur";
    maxSize?: number;
    progressive?: boolean;
  },
): Promise<Loaded<typeof ImageDefinition, { original: true }>>;

```

#### `image`

The image to create an `ImageDefinition` from.

This can be a `Blob` or a `File`.

#### `owner`

The owner of the `ImageDefinition`. This is used to control access to the image. See [Groups as permission scopes](/docs/permissions-and-sharing/overview) for more information on how to use groups to control access to images.

#### `placeholder`

Disabled by default. This option allows you to automatically generate a low resolution preview for use while the image is loading. Currently, only `"blur"` is a supported.

#### `maxSize`

The image generation process includes a maximum size setting that controls the longest side of the image. A built-in resizing feature is applied based on this setting.

#### `progressive`

The progressive loading pattern is a technique that allows images to load incrementally, starting with a small version and gradually replacing it with a larger version as it becomes available. This is useful for improving the user experience by showing a placeholder while the image is loading.

Passing `progressive: true` to `createImage()` will create internal smaller versions of the image for future uses.

### Create multiple resized copies

To create multiple resized copies of an original image for better layout control, you can use the `createImage` function multiple times with different parameters for each desired size. Here’s an example of how you might implement this:

```ts
import { co } from "jazz-tools";
import { createImage } from "jazz-tools/media";

// Jazz Schema
const ProductImage = co.map({
  image: co.image(),
  thumbnail: co.image(),
});

const mainImage = await createImage(myBlob);
const thumbnail = await createImage(myBlob, {
  maxSize: 100,
});

// or, in case of migration, you can use the original stored image.
const newThumb = await createImage(mainImage!.original!.toBlob()!, {
  maxSize: 100,
});

const imageSet = ProductImage.create({
  image: mainImage,
  thumbnail,
});

```

### Creating images on the server

We provide a `createImage` function to create images from server side using the same options as the browser version, using the package `jazz-tools/media/server`. Check the [server worker](/docs/server-side/setup) documentation to learn more.

The resize features are based on the `sharp` library, then it is requested as peer dependency in order to use it.

```sh
npm install sharp

```

```ts
import fs from "node:fs";
import { createImage } from "jazz-tools/media/server";

const image = fs.readFileSync(new URL("./image.jpg", import.meta.url));

await createImage(image, {
  // options
});

```

## Displaying Images

Like other CoValues, `ImageDefinition` can be used to load the object.

```tsx
const image = await ImageDefinition.load("123", {
  resolve: {
    original: true,
  },
});

if (image.$isLoaded) {
  console.log({
    originalSize: image.originalSize,
    placeholderDataUrl: image.placeholderDataURL,
    original: image.original, // this FileStream may be not loaded yet
  });
}

```

`image.original` is a `FileStream` and its content can be read as described in the [FileStream](/docs/core-concepts/covalues/filestreams#reading-from-filestreams) documentation.

Since FileStream objects are also CoValues, they must be loaded before use. To simplify loading, if you want to load the binary data saved as Original, you can use the `loadImage` function.

```tsx
import { loadImage } from "jazz-tools/media";

const loadedImage = await loadImage(imageDefinitionOrId);
if (loadedImage === null) {
  throw new Error("Image not found");
}

const img = document.createElement("img");
img.width = loadedImage.width;
img.height = loadedImage.height;
img.src = URL.createObjectURL(loadedImage.image.toBlob()!);
img.onload = () => URL.revokeObjectURL(img.src);

```

If the image was generated with progressive loading, and you want to access the best-fit resolution, use `loadImageBySize`. It will load the image of the best resolution that fits the wanted width and height.

```tsx
import { loadImageBySize } from "jazz-tools/media";

const imageLoadedBySize = await loadImageBySize(imageDefinitionOrId, 600, 600); // 600x600

if (imageLoadedBySize) {
  console.log({
    width: imageLoadedBySize.width,
    height: imageLoadedBySize.height,
    image: imageLoadedBySize.image,
  });
}

```

If want to dynamically listen to the _loaded_ resolution that best fits the wanted width and height, you can use the `subscribe` and the `highestResAvailable` function.

```tsx
import { highestResAvailable } from "jazz-tools/media";

const progressiveImage = await ImageDefinition.load(imageId);

if (!progressiveImage.$isLoaded) {
  throw new Error("Image not loaded");
}

const img = document.createElement("img");
img.width = 600;
img.height = 600;

// start with the placeholder
if (progressiveImage.placeholderDataURL) {
  img.src = progressiveImage.placeholderDataURL;
}

// then listen to the image changes
progressiveImage.$jazz.subscribe({}, (image) => {
  const bestImage = highestResAvailable(image, 600, 600);

  if (bestImage) {
    // bestImage is again a FileStream
    const blob = bestImage.image.toBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      img.src = url;
      img.onload = () => URL.revokeObjectURL(url);
    }
  }
});

```

## Custom image manipulation implementations

To manipulate images (like placeholders, resizing, etc.), `createImage()` uses different implementations depending on the environment.

If you want to use a custom implementation, you can use the `createImageFactory` function in order create your own `createImage` function and use your preferred image manipulation library.

```tsx
import { createImageFactory } from "jazz-tools/media";

const customCreateImage = createImageFactory({
  createFileStreamFromSource: async (source, owner) => {
    // ...
  },
  getImageSize: async (image) => {
    // ...
  },
  getPlaceholderBase64: async (image) => {
    // ...
  },
  resize: async (image, width, height) => {
    // ...
  },
});

```

## Best Practices

* **Set image sizes** when possible to avoid layout shifts
* **Use placeholders** (like LQIP - Low Quality Image Placeholders) for instant rendering
* **Prioritize loading** the resolution appropriate for the current viewport
* **Consider device pixel ratio** (window.devicePixelRatio) for high-DPI displays
* **Always call URL.revokeObjectURL** after the image loads to prevent memory leaks


### Connecting CoValues
# Connecting CoValues with direct linking

CoValues can form relationships with each other by **linking directly to other CoValues**. This creates a powerful connection where one CoValue can point to the unique identity of another. Instead of embedding all the details of one CoValue directly within another, you use its Jazz-Tools schema as the field type. This allows multiple CoValues to point to the same piece of data effortlessly.

```ts
import { co, z, Loaded, Group, Account } from "jazz-tools";

export const Location = co.map({
  city: z.string(),
  country: z.string(),
});
export type Location = co.loaded<typeof Location>;

// co.ref can be used within CoMap fields to point to other CoValues
const Actor = co.map({
  name: z.string,
  imageURL: z.string,
  birthplace: Location, // Links directly to the Location CoMap above.
});
export type Actor = co.loaded<typeof Actor>;

//  actual actor data is stored in the separate Actor CoValue
const Movie = co.map({
  title: z.string,
  director: z.string,
  cast: co.list(Actor), // ordered, mutable
});
export type Movie = co.loaded<typeof Movie>;

// A User CoMap can maintain a CoFeed of co.ref(Movie) to track their favorite movies
const User = co.map({
  username: z.string,
  favoriteMovies: co.feed(Movie), // append-only
});
export type User = co.loaded<typeof User>;

```

### Understanding CoList and CoFeed

* CoList is a collaborative list where each item is a reference to a CoValue
* CoFeed contains an append-only list of references to CoValues.

This direct linking approach offers a single source of truth. When you update a referenced CoValue, all other CoValues that point to it are automatically updated, ensuring data consistency across your application.

By connecting CoValues through these direct references, you can build robust and collaborative applications where data is consistent, efficient to manage, and relationships are clearly defined. The ability to link different CoValue types to the same underlying data is fundamental to building complex applications with Jazz.


### Accounts & migrations
# Accounts & Migrations

## CoValues as a graph of data rooted in accounts

Compared to traditional relational databases with tables and foreign keys, Jazz is more like a graph database, or GraphQL APIs — where CoValues can arbitrarily refer to each other and you can resolve references without having to do a join. (See [Subscribing & deep loading](/docs/core-concepts/subscription-and-loading)).

To find all data related to a user, the account acts as a root node from where you can resolve all the data they have access to. These root references are modeled explicitly in your schema, distinguishing between data that is typically public (like a user's profile) and data that is private (like their messages).

### `Account.root` \- private data a user cares about

Every Jazz app that wants to refer to per-user data needs to define a custom root `CoMap` schema and declare it in a custom `Account` schema as the `root` field:

```ts
import { co, z } from "jazz-tools";

const MyAppRoot = co.map({
  myChats: co.list(Chat),
});

export const MyAppAccount = co.account({
  root: MyAppRoot,
  profile: co.profile(),
});

```

### `Account.profile` \- public data associated with a user

The built-in `Account` schema class comes with a default `profile` field, which is a CoMap (in a Group with `"everyone": "reader"` \- so publicly readable permissions) that is set up for you based on the username the `AuthMethod` provides on account creation.

Their pre-defined schemas roughly look like this:

```ts
// ...somewhere in jazz-tools itself...
const Account = co.account({
  root: co.map({}),
  profile: co.profile(),
});

```

If you want to keep the default `co.profile()` schema, but customise your account's private `root`, you can use `co.profile()` without options.

If you want to extend the `profile` to contain additional fields (such as an avatar `co.image()`), you can declare your own profile schema class using `co.profile({...})`. A `co.profile({...})` is a [type of CoMap](/docs/core-concepts/covalues/comaps), so you can add fields in the same way:

```ts
export const MyAppProfile = co.profile({
  name: z.string(), // compatible with default Profile schema
  avatar: co.optional(co.image()),
});

export const MyAppAccountWithProfile = co.account({
  root: MyAppRoot,
  profile: MyAppProfile,
});

```

**Info:** 

When using custom profile schemas, you need to take care of initializing the `profile` field in a migration, and set up the correct permissions for it. See [Adding/changing fields to root and profile](#addingchanging-fields-to-root-and-profile).

## Resolving CoValues starting at `profile` or `root`

To use per-user data in your app, you typically use your custom Account schema with a `.subscribe()` call, and specify which references to resolve using a resolve query (see [Subscribing & deep loading](/docs/core-concepts/subscription-and-loading)).

Jazz will deduplicate loads, so you can safely use this pattern multiple times throughout your app without any performance overhead to ensure each part of your app has exactly the data it needs.

```ts
import { MyAppAccount } from "./schema";

const unsubscribe = MyAppAccount.getMe().$jazz.subscribe(
{
  resolve: {
    profile: true,
    root: {
      myChats: { $each: true },
    },
  },
},
(account) => {
  const myNameElement = document.getElementById("my-name");
  if (myNameElement) {
    myNameElement.textContent = account.profile.name;
  }
},
);

// When you're ready to clean up:
unsubscribe();

```

## Populating and evolving `root` and `profile` schemas with migrations

As you develop your app, you'll likely want to

* initialise data in a user's `root` and `profile`
* add more data to your `root` and `profile` schemas

You can achieve both by overriding the `migrate()` method on your `Account` schema class.

### When migrations run

Migrations are run after account creation and every time a user logs in. Jazz waits for the migration to finish before passing the account to your app's context.

### Initialising user data after account creation

```ts
export const MyAppAccountWithMigration = co
  .account({
    root: MyAppRoot,
    profile: MyAppProfile,
  })
  .withMigration((account, creationProps?: { name: string }) => {
    // we use has to check if the root has ever been set
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        myChats: [],
      });
    }

    if (!account.$jazz.has("profile")) {
      const profileGroup = Group.create();
      // Unlike the root, we want the profile to be publicly readable.
      profileGroup.makePublic();

      account.$jazz.set(
        "profile",
        MyAppProfile.create(
          {
            name: creationProps?.name ?? "New user",
          },
          profileGroup,
        ),
      );
    }
  });

```

### Adding/changing fields to `root` and `profile`

To add new fields to your `root` or `profile` schemas, amend their corresponding schema classes with new fields, and then implement a migration that will populate the new fields for existing users (by using initial data, or by using existing data from old fields).

To do deeply nested migrations, you might need to use the asynchronous `$jazz.ensureLoaded()` method before determining whether the field already exists, or is simply not loaded yet.

Now let's say we want to add a `myBookmarks` field to the `root` schema:

```ts
const MyAppRoot = co.map({
  myChats: co.list(Chat),
  myBookmarks: co.optional(co.list(Bookmark)), // [!code ++:1]
});

export const MyAppAccount = co
  .account({
    root: MyAppRoot,
    profile: MyAppProfile,
  })
  .withMigration(async (account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        myChats: [],
      });
    }

    // We need to load the root field to check for the myBookmarks field
    const { root } = await account.$jazz.ensureLoaded({
      resolve: { root: true },
    });

    if (!root.$jazz.has("myBookmarks")) {
      // [!code ++:3]
      root.$jazz.set(
        "myBookmarks",
        co.list(Bookmark).create([], Group.create()),
      );
    }
  });

```

### Guidance on building robust schemas

Once you've published a schema, you should only ever add fields to it. This is because you have no way of ensuring that a new schema is distributed to all clients, especially if you're building a local-first app.

You should plan to be able to handle data from users using any former schema version that you have published for your app.


### Schema Unions
# Schema Unions

Schema unions allow you to create types that can be one of several different schemas, similar to TypeScript union types. They use a discriminator field to determine which specific schema an instance represents at runtime, enabling type-safe polymorphism in your Jazz applications.

The following operations are not available in schema unions:

* `$jazz.ensureLoaded` — use the union schema's `load` method, or narrow the type first
* `$jazz.subscribe` — use the union schema's `subscribe` method
* `$jazz.set` — use `$jazz.applyDiff`

## Creating schema unions

Schema unions are defined with `co.discriminatedUnion()` by providing an array of schemas and a discriminator field. The discriminator field must be a `z.literal()`.

```ts
export const ButtonWidget = co.map({
  type: z.literal("button"),
  label: z.string(),
});

export const SliderWidget = co.map({
  type: z.literal("slider"),
  min: z.number(),
  max: z.number(),
});

export const WidgetUnion = co.discriminatedUnion("type", [
  ButtonWidget,
  SliderWidget,
]);

```

To instantiate a schema union, just use the `create` method of one of the member schemas:

```ts
const dashboard = Dashboard.create({
  widgets: [
    ButtonWidget.create({ type: "button", label: "Click me" }),
    SliderWidget.create({ type: "slider", min: 0, max: 100 }),
  ],
});

```

You can also use plain JSON objects, and let Jazz infer the concrete type from the discriminator field:

```ts
const dashboardFromJSON = Dashboard.create({
  widgets: [
    { type: "button", label: "Click me" },
    { type: "slider", min: 0, max: 100 },
  ],
});

```

## Narrowing unions

When working with schema unions, you can access any property that is common to all members of the union. To access properties specific to a particular union member, you need to narrow the type. You can do this using a [TypeScript type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) on the discriminator field:

```ts
dashboard.widgets.forEach((widget) => {
  if (widget.type === "button") {
    console.log(`Button: ${widget.label}`);
  } else if (widget.type === "slider") {
    console.log(`Slider: ${widget.min} to ${widget.max}`);
  }
});

```

## Loading schema unions

You can load an instance of a schema union using its ID, without having to know its concrete type:

```ts
const widget = await WidgetUnion.load(widgetId);

// Subscribe to updates
const unsubscribe = WidgetUnion.subscribe(widgetId, {}, (widget) => {
  console.log("Widget updated:", widget);
});

```

## Nested schema unions

You can create complex hierarchies by nesting discriminated unions within other unions:

```ts
// Define error types
const BadRequestError = co.map({
  status: z.literal("failed"),
  code: z.literal(400),
  message: z.string(),
});

const UnauthorizedError = co.map({
  status: z.literal("failed"),
  code: z.literal(401),
  message: z.string(),
});

const InternalServerError = co.map({
  status: z.literal("failed"),
  code: z.literal(500),
  message: z.string(),
});

// Create a union of error types
const ErrorResponse = co.discriminatedUnion("code", [
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
]);

// Define success type
const SuccessResponse = co.map({
  status: z.literal("success"),
  data: z.string(),
});

// Create a top-level union that includes the error union
const ApiResponse = co.discriminatedUnion("status", [
  SuccessResponse,
  ErrorResponse,
]);

function handleResponse(response: co.loaded<typeof ApiResponse>) {
  if (response.status === "success") {
    console.log("Success:", response.data);
  } else {
    // This is an error - narrow further by error code
    if (response.code === 400) {
      console.log("Bad request:", response.message);
    } else if (response.code === 401) {
      console.log("Unauthorized:", response.message);
    } else if (response.code === 500) {
      console.log("Server error:", response.message);
    }
  }
}

```

## Limitations with schema unions

Schema unions have some limitations that you should be aware of. They are due to TypeScript behaviour with type unions: when the type members of the union have methods with generic parameters, TypeScript will not allow calling those methods on the union type. This affects some of the methods on the `$jazz` namespace.

Note that these methods may still work at runtime, but their use is not recommended as you will lose type safety.

### `$jazz.ensureLoaded` and `$jazz.subscribe` require type narrowing

The `$jazz.ensureLoaded` and `$jazz.subscribe` methods are not supported directly on a schema union unless you first narrow the type using the discriminator.

### Updating union fields

You can't use `$jazz.set` to modify a schema union's fields (even if the field is present in all the union members). Use `$jazz.applyDiff` instead.


### Codecs
# Codecs

You can use Zod `z.codec()` schemas to store arbitrary data types such as class instances within CoValues by defining custom encoders. This allows you to directly use these data types within CoValues without having to do an extra manual conversion step.

## Using Zod codecs

To use a Zod `z.codec()` with Jazz, your encoder must encode the data into a JSON-compatible format. This is means that the `Input` type shall map to the JSON-compatible type, and `Output` will map to your custom type.

```ts
class Greeter {
  constructor(public name: string) {}

  greet() {
    console.log(`Hello, ${this.name}!`);
  }
}

const schema = co.map({
  greeter: z.codec(z.string(), z.z.instanceof(Greeter), {
    encode: (value) => value.name,
    decode: (value) => new Greeter(value),
  }),
});

const porter = schema.create({
  greeter: new Greeter("Alice"),
});

porter.greeter.greet();

```

**Info:** 

Schemas that are not directly supported by Jazz such as `z.instanceof` are not re-exported by Jazz under the `z` object. The full Zod API is exported under `z.z` if you need to use any of these schemas as part of a codec.


### Subscriptions & Deep Loading
# Subscriptions & Deep Loading

Jazz's Collaborative Values (such as [CoMaps](/docs/core-concepts/covalues/comaps) or [CoLists](/docs/core-concepts/covalues/colists)) are reactive. You can subscribe to them to automatically receive updates whenever they change, either locally or remotely.

You can also use subscriptions to load CoValues _deeply_ by resolving nested values. You can specify exactly how much data you want to resolve and handle loading states and errors.

You can load and subscribe to CoValues in one of two ways:

* **shallowly** — all of the primitive fields are available (such as strings, numbers, dates), but the references to other CoValues are not loaded
* **deeply** — some or all of the referenced CoValues have been loaded

**Info: Tip** 

Jazz automatically deduplicates loading. If you subscribe to the same CoValue multiple times in your app, Jazz will only fetch it once. That means you don’t need to deeply load a CoValue _just in case_ a child component might need its data, and you don’t have to worry about tracking every possible field your app needs in a top-level query. Instead, pass the CoValue ID to the child component and subscribe there — Jazz will only load what that component actually needs.

## Subscription Hooks

On your front-end, using a subscription hook is the easiest way to manage your subscriptions. The subscription and related clean-up is handled automatically, and you can use your data like any other piece of state in your app.

### Subscribe to CoValues

```tsx
import { useCoState } from "jazz-tools/react";

function ProjectView({ projectId }: { projectId: string }) {
  // Subscribe to a project and resolve its tasks
  const project = useCoState(Project, projectId, {
    resolve: { tasks: { $each: true } }, // Tell Jazz to load each task in the list
  });

  if (!project.$isLoaded) {
    switch (project.$jazz.loadingState) {
      case "unauthorized":
        return "Project not accessible";
      case "unavailable":
        return "Project not found";
      case "loading":
        return "Loading project...";
    }
  }

  return (
    <div>
      <h1>{project.name}</h1>
      <ul>
        {project.tasks.map((task) => (
          <li key={task.$jazz.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

```

**Note:** If you don't need to load a CoValue's references, you can choose to load it _shallowly_ by omitting the resolve query.

### Subscribe to the current user's account

```tsx
import { useAccount } from "jazz-tools/react";
import { MyAppAccount } from "./schema";

function ProjectList() {
  const me = useAccount(MyAppAccount, {
    resolve: { profile: true },
  });

  if (!me.$isLoaded) {
    return "Loading...";
  }

  return (
    <div>
      <h1>{me.profile.name}'s projects</h1>
    </div>
  );
}

```

### Loading States

When you load or subscribe to a CoValue through a hook (or directly), it can be either:

* **Loaded** → The CoValue has been successfully loaded and all its data is available
* **Not Loaded** → The CoValue is not yet available

You can use the `$isLoaded` field to check whether a CoValue is loaded. For more detailed information about why a CoValue is not loaded, you can check `$jazz.loadingState`:

* `"loading"` → The CoValue is still being fetched
* `"unauthorized"` → The current user doesn't have permission to access this CoValue
* `"unavailable"` → The CoValue couldn't be found or an error (e.g. a network timeout) occurred while loading

See the examples above for practical demonstrations of how to handle these three states in your application.

## Deep Loading

When you're working with related CoValues (like tasks in a project), you often need to load nested references as well as the top-level CoValue.

This is particularly the case when working with [CoMaps](/docs/core-concepts/covalues/comaps) that refer to other CoValues or [CoLists](/docs/core-concepts/covalues/colists) of CoValues. You can use `resolve` queries to tell Jazz what data you need to use.

### Using Resolve Queries

A `resolve` query tells Jazz how deeply to load data for your app to use. We can use `true` to tell Jazz to shallowly load the tasks list here. Note that this does _not_ cause the tasks themselves to load, just the CoList that holds the tasks.

```ts
const Task = co.map({
  title: z.string(),
  description: co.plainText(),
  get subtasks() {
    return co.list(Task);
  },
});

const Project = co.map({
  name: z.string(),
  tasks: co.list(Task),
});

const project = await Project.load(projectId);
if (!project.$isLoaded) throw new Error("Project not found or not accessible");

// This will be loaded
project.name; // string

// This *may not be loaded*, and *may not be accessible*
project.tasks; // MaybeLoaded<ListOfTasks>

const projectWithTasksShallow = await Project.load(projectId, {
  resolve: {
    tasks: true,
  },
});
if (!projectWithTasksShallow.$isLoaded)
  throw new Error("Project not found or not accessible");

// This list of tasks will be shallowly loaded
projectWithTasksShallow.tasks; // ListOfTasks
// We can access the properties of the shallowly loaded list
projectWithTasksShallow.tasks.length; // number
// This *may not be loaded*, and *may not be accessible*
projectWithTasksShallow.tasks[0]; // MaybeLoaded<Task>

```

We can use an `$each` expression to tell Jazz to load the items in a list.

```ts
const projectWithTasks = await Project.load(projectId, {
  resolve: {
    tasks: {
      $each: true,
    },
  },
});
if (!projectWithTasks.$isLoaded)
  throw new Error("Project not found or not accessible");

// The task will be loaded
projectWithTasks.tasks[0]; // Task
// Primitive fields are always loaded
projectWithTasks.tasks[0].title; // string
// References on the Task may not be loaded
projectWithTasks.tasks[0].subtasks; // MaybeLoaded<ListOfTasks>
// CoTexts are CoValues too
projectWithTasks.tasks[0].description; // MaybeLoaded<CoPlainText>

```

We can also build a query that _deeply resolves_ to multiple levels:

```ts
const projectDeep = await Project.load(projectId, {
  resolve: {
    tasks: {
      $each: {
        subtasks: {
          $each: true,
        },
        description: true,
      },
    },
  },
});
if (!projectDeep.$isLoaded)
  throw new Error("Project not found or not accessible");

// Primitive fields are always loaded
projectDeep.tasks[0].subtasks[0].title; // string

// The description will be loaded as well
projectDeep.tasks[0].description; // CoPlainText

```

**Warning: Always load data explicitly** 

If you access a reference that wasn't included in your `resolve` query, you may find that it is already loaded, potentially because some other part of your app has already loaded it. **You should not rely on this**.

Expecting data to be there which is not explicitly included in your `resolve` query can lead to subtle, hard-to-diagnose bugs. Always include every nested CoValue you need to access in your `resolve` query.

### Where To Use Resolve Queries

The syntax for resolve queries is shared throughout Jazz. As well as using them in `load` and `subscribe` method calls, you can pass a resolve query to a front-end hook.

```tsx
const projectId = "";
const projectWithTasksShallow = useCoState(Project, projectId, {
  resolve: {
    tasks: true,
  },
});

```

You can also specify resolve queries at the schema level, using the `.resolved()` method. These queries will be used when loading CoValues from that schema (if no resolve query is provided by the user) and in types defined with [co.loaded](/docs/core-concepts/subscription-and-loading#type-safety-with-coloaded).

```ts
const TaskWithDescription = Task.resolved({
  description: true,
});
const ProjectWithTasks = Project.resolved({
  tasks: {
    // Use `.resolveQuery` to get the resolve query from a schema and compose it in other queries
    $each: TaskWithDescription.resolveQuery,
  }
});

// .load() will use the resolve query from the schema
const project = await ProjectWithTasks.load(projectId);
if (!project.$isLoaded) throw new Error("Project not found or not accessible");
// Both the tasks and the descriptions are loaded
project.tasks[0].description; // CoPlainText

```

## Loading Errors

A load operation will be successful **only** if all references requested (both optional and required) could be successfully loaded. If any reference cannot be loaded, the entire load operation will return a not-loaded CoValue to avoid potential inconsistencies.

```ts
// If permissions on description are restricted:
const task = await Task.load(taskId, {
  resolve: { description: true },
});
task.$isLoaded; // false
task.$jazz.loadingState; // "unauthorized"

```

This is also true if **any** element of a list is inaccessible, even if all the others can be loaded.

```ts
// One task in the list has restricted permissions
const projectWithUnauthorizedTasks = await Project.load(projectId, {
  resolve: { tasks: { $each: true } },
});

project.$isLoaded; // false
project.$jazz.loadingState; // "unauthorized"

```

Loading will be successful if all requested references are loaded. Non-requested references may or may not be available.

```ts
// One task in the list has restricted permissions
const shallowlyLoadedProjectWithUnauthorizedTasks = await Project.load(
  projectId,
  {
    resolve: true,
  },
);
if (!project.$isLoaded) throw new Error("Project not found or not accessible");

// Assuming the user has permissions on the project, this load will succeed, even if the user cannot load one of the tasks in the list
project.$isLoaded; // true
// Tasks may not be loaded since we didn't request them
project.tasks.$isLoaded; // may be false

```

### Catching loading errors

We can use `$onError` to handle cases where some data you have requested is inaccessible, similar to a `try...catch` block in your query.

For example, in case of a `project` (which the user can access) with three `task` items:

| Task | User can access task? | User can access task.description? |
| ---- | --------------------- | --------------------------------- |
| 0    | ✅                     | ✅                                 |
| 1    | ✅                     | ❌                                 |
| 2    | ❌                     | ❌                                 |

#### Scenario 1: Skip Inaccessible List Items

If some of your list items may not be accessible, you can skip loading them by specifying `$onError: 'catch'`. Inaccessible items will be not-loaded CoValues, while accessible items load properly.

```ts
// Inaccessible tasks will not be loaded, but the project will
const projectWithInaccessibleSkipped = await Project.load(projectId, {
  resolve: { tasks: { $each: { $onError: "catch" } } },
});

if (!project.$isLoaded) {
  throw new Error("Project not found or not accessible");
}

if (!project.tasks.$isLoaded) {
  throw new Error("Task List not found or not accessible");
}

project.tasks[0].$isLoaded; // true
project.tasks[1].$isLoaded; // true
project.tasks[2].$isLoaded; // false (caught by $onError)

```

#### Scenario 2: Handling Inaccessible Nested References

An `$onError` applies only in the block where it's defined. If you need to handle multiple potential levels of error, you can nest `$onError` handlers.

This load will fail, because the `$onError` is defined only for the `task.description`, not for failures in loading the `task` itself.

```ts
// Inaccessible tasks will not be loaded, but the project will
const projectWithNestedInaccessibleSkipped = await Project.load(projectId, {
  resolve: {
    tasks: {
      $each: {
        description: true,
        $onError: "catch",
      },
    },
  },
});

if (!project.$isLoaded) {
  throw new Error("Project not found or not accessible");
}

project.tasks[0].$isLoaded; // true
project.tasks[1].$isLoaded; // true
project.tasks[2].$isLoaded; // false (caught by $onError)

```

We can fix this by adding handlers at both levels

```ts
const projectWithMultipleCatches = await Project.load(projectId, {
  resolve: {
    tasks: {
      $each: {
        description: { $onError: "catch" }, // catch errors loading task descriptions
        $onError: "catch", // catch errors loading tasks too
      },
    },
  },
});

project.$isLoaded; // true
project.tasks[0].$isLoaded; // true
project.tasks[0].description.$isLoaded; // true
project.tasks[1].$isLoaded; // true
project.tasks[1].description.$isLoaded; // false (caught by the inner handler)
project.tasks[2].$isLoaded; // false (caught by the outer handler)

```

## Type safety with co.loaded

You can tell your application how deeply your data is loaded by using the `co.loaded` type.

The `co.loaded` type is especially useful when passing data between components, because it allows TypeScript to check at compile time whether data your application depends is properly loaded. The second argument lets you pass a `resolve` query to specify how deeply your data is loaded.

```tsx
import { co } from "jazz-tools";
import { Project } from "./schema";

type ProjectWithTasks = co.loaded<
  typeof Project,
  {
    tasks: {
      $each: true;
    };
  }
>;

// In case the project prop isn't loaded as required, TypeScript will warn
function TaskList({ project }: { project: ProjectWithTasks }) {
  // TypeScript knows tasks are loaded, so this is type-safe
  return (
    <ul>
      {project.tasks.map((task) => (
        <li key={task.$jazz.id}>{task.title}</li>
      ))}
    </ul>
  );
}

```

You can pass a `resolve` query of any complexity to `co.loaded`.

## Manual subscriptions

If you have a CoValue's ID, you can subscribe to it anywhere in your code using `CoValue.subscribe()`.

**Note:** Manual subscriptions are best suited for vanilla JavaScript — for example in server-side code or tests. Inside front-end components, we recommend using a subscription hook.

```ts
// Subscribe by ID
const unsubscribe = Task.subscribe(taskId, {}, (updatedTask) => {
  console.log("Updated task:", updatedTask);
});

// Always clean up when finished
unsubscribe();

```

You can also subscribe to an existing CoValue instance using the `$jazz.subscribe` method.

```ts
const myTask = Task.create({
  title: "My new task",
});

// Subscribe using $jazz.subscribe
const unsubscribe = myTask.$jazz.subscribe((updatedTask) => {
  console.log("Updated task:", updatedTask);
});

// Always clean up when finished
unsubscribe();

```

## Ensuring data is loaded

In most cases, you'll have specified the depth of data you need in a `resolve` query when you first load or subscribe to a CoValue. However, sometimes you might have a CoValue instance which is not loaded deeply enough, or you're not sure how deeply loaded it is. In this case, you need to make sure data is loaded before proceeding with an operation. The `$jazz.ensureLoaded` method lets you guarantee that a CoValue and its referenced data are loaded to a specific depth (i.e. with nested references resolved):

```ts
async function completeAllTasks(projectId: string) {
  // Load the project
  const project = await Project.load(projectId, { resolve: true });
  if (!project.$isLoaded) return;

  // Ensure tasks are deeply loaded
  const loadedProject = await project.$jazz.ensureLoaded({
    resolve: {
      tasks: {
        $each: true,
      },
    },
  });

  // Now we can safely access and modify tasks
  loadedProject.tasks.forEach((task, i) => {
    task.$jazz.set("title", `Task ${i}`);
  });
}

```

This can be useful if you have a shallowly loaded CoValue instance, and would like to load its references deeply.

## Best practices

* Load exactly what you need. Start shallow and add your nested references with care.
* Always check `$isLoaded` before accessing CoValue data. Use `$jazz.loadingState` for more detailed information.
* Use `$onError: 'catch'` at each level of your query that can fail to handle inaccessible data gracefully.
* Never rely on data being present unless it is requested in your `resolve` query.


### Sync and storage
# Sync and storage: Jazz Cloud or self-hosted

For sync and storage, you can either use Jazz Cloud for zero-config magic, or run your own sync server.

## Using Jazz Cloud

Sign up for a free API key at [dashboard.jazz.tools](https://dashboard.jazz.tools) for higher limits or production use, or use your email address as a temporary key to get started quickly.

```bash
NEXT_PUBLIC_JAZZ_API_KEY="you@example.com" # or your API key

```

Replace the API key in the sync server URL with your API key.

```
wss://cloud.jazz.tools/?key=YOUR_API_KEY

```

```tsx
import { createJazzBrowserContext } from "jazz-tools/browser";

// Get a free API Key at dashboard.jazz.tools, or use your email as a temporary key.
const apiKey = "you@example.com";
const ctx = await createJazzBrowserContext({
  sync: {
    peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
  },
  // Rest of config
});

```

Jazz Cloud will

* sync CoValues in real-time between users and devices
* safely persist CoValues on redundant storage nodes with additional backups
* make use of geographically distributed cache nodes for low latency

### Free public alpha

* Jazz Cloud is free during the public alpha, with no strict usage limits
* We plan to keep a free tier, so you'll always be able to get started with zero setup
* See [Jazz Cloud pricing](/cloud#pricing) for more details

## Self-hosting your sync server

You can run your own sync server using:

```sh
npx jazz-run sync

```

And then use `ws://localhost:4200` as the sync server URL.

You can also run this simple sync server behind a proxy that supports WebSockets, for example to provide TLS. In this case, provide the WebSocket endpoint your proxy exposes as the sync server URL.

**Info:** 

Requires at least Node.js v20\. See our [Troubleshooting Guide](/docs/troubleshooting) for quick fixes.

### Command line options:

* `--host` / `-h` \- the host to run the sync server on. Defaults to 127.0.0.1.
* `--port` / `-p` \- the port to run the sync server on. Defaults to 4200.
* `--in-memory` \- keep CoValues in-memory only and do sync only, no persistence. Persistence is enabled by default.
* `--db` \- the path to the file where to store the data (SQLite). Defaults to `sync-db/storage.db`.

### Source code

The implementation of this simple sync server is available open-source [on GitHub](https://github.com/garden-co/jazz/blob/main/packages/jazz-run/src/startSyncServer.ts).


## Key Features

### Overview
# Authentication in Jazz

Jazz authentication is based on cryptographic keys ("Account keys"). Their public part represents a user's identity, their secret part lets you act as that user.

## Authentication Flow

When a user first opens your app, they'll be in one of these states:

* **Anonymous Authentication**: Default starting point where Jazz automatically creates a local account on first visit. Data persists on one device and can be upgraded to a full account.
* **Authenticated Account**: Full account accessible across multiple devices using [passkeys](/docs/key-features/authentication/passkey), [passphrases](/docs/key-features/authentication/passphrase), or third-party authentications, such as [Clerk](/docs/key-features/authentication/clerk).
* **Guest Mode**: No account, read-only access to public content. Users can browse but can't save data or sync.

Learn more about these states in the [Authentication States](/docs/key-features/authentication/authentication-states) documentation.

Without authentication, users are limited to using the application on only one device.

When a user logs out of an Authenticated Account, they return to the Anonymous Authentication state with a new local account.

Here's what happens during registration and login:

* **Register**: When a user registers with an authentication provider, their Anonymous account credentials are stored in the auth provider, and the account is marked as Authenticated. The user keeps all their existing data.
* **Login**: When a user logs in with an authentication provider, their Anonymous account is discarded and the credentials are loaded from the auth provider. Data from the Anonymous account can be transferred using the [onAnonymousAccountDiscarded handler](/docs/key-features/authentication/authentication-states#migrating-data-from-anonymous-to-authenticated-account).

## Available Authentication Methods

Jazz provides several ways to authenticate users:

* [**Passkeys**](/docs/key-features/authentication/passkey): Secure, biometric authentication using WebAuthn
* [**Passphrases**](/docs/key-features/authentication/passphrase): Bitcoin-style word phrases that users store
* [**Clerk Integration**](/docs/key-features/authentication/clerk): Third-party authentication service with OAuth support
* [**Better Auth**](/docs/key-features/authentication/better-auth): Self-hosted authentication service

**Note**: For serverless authentication methods (passkey, passphrase), Jazz stores your account's credentials in your browser's local storage. This avoids needing to reauthenticate on every page load, but means you must take extra care to avoid [XSS attacks](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS). In particular, you should take care to [sanitise user input](https://github.com/cure53/DOMPurify), set [appropriate CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), and avoid third-party JavaScript wherever possible.


### Quickstart
# Add Authentication to your App

This guide will show you how you can access your data on multiple devices by signing in to your app.

**Info:** 

If you haven't gone through the [front-end Quickstart](/docs/quickstart), you might find this guide a bit confusing. If you're looking for a quick reference, you might find [this page](/docs/key-features/authentication/overview) or our [Passkey Auth example app](https://github.com/gardencmp/jazz/tree/main/starters/react-passkey-auth) more helpful!

## Add passkey authentication

Jazz has a built-in passkey authentication component that you can use to add authentication to your app. This is the easiest way to get started with securely authenticating users into your application. By adding this component, when users access your app, they'll be greeted with an input where they can enter their name, and create a passkey.

```tsx
"use client"; // tells Next.js that this component can't be server-side rendered. If you're not using Next.js, you can remove it.
// [!code --:1]
import { JazzReactProvider } from "jazz-tools/react";
// [!code ++:1]
import { JazzReactProvider, PasskeyAuthBasicUI } from "jazz-tools/react";
import { JazzFestAccount } from "@/app/schema";

const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY;

export function JazzWrapper({ children }: { children: React.ReactNode }) {
return (
  <JazzReactProvider
    sync={{
      peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
    }}
    AccountSchema={JazzFestAccount}
  >
    {/* [!code ++:1] */}
    <PasskeyAuthBasicUI appName="JazzFest">
      {children}
      {/* [!code ++:1] */}
    </PasskeyAuthBasicUI>
  </JazzReactProvider>
);
}

```

## Give it a go!

... what, already?! Yes! Run your app and try creating a passkey and logging in!

```bash
npm run dev

```

### Not working?

* Did you add `<PasskeyAuthBasicUI>` _inside_ your provider?
* Does it wrap all the children?
* Are you running your app in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure%5FContexts) (either HTTPS or localhost)?

**Info: Still stuck?** Ask for help on [Discord](https://discord.gg/utDMjHYg42)!

## Add a recovery method

Passkeys are very convenient for your users because they offer a secure alternative to traditional authentication methods and they're normally synchronised across devices automatically by the user's browser or operating system.

However, they're not available everywhere, and in case the user loses or deletes their passkey by mistake, they won't be able to access their account.

So, let's add a secondary login method using a passphrase. You can integrate [as many different authentication methods as you like](https://github.com/garden-co/jazz/tree/main/examples/multiauth) in your app.

### Create an `Auth` component

The `PasskeyAuthBasicUI` component is not customisable, so we'll implement our own Auth component so that we can extend it.

```tsx
import { useState } from "react";
import { usePasskeyAuth } from "jazz-tools/react";

export function Auth({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");

  const auth = usePasskeyAuth({
    // Must be inside the JazzProvider because the hook depends on an active Jazz context.
    appName: "JazzFest",
  });

  return (
    <>
      <div>
        <button onClick={() => auth.logIn()}>Log in</button>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => auth.signUp(name)}>Sign up</button>
      </div>
      {auth.state === "signedIn" && children}
    </>
  );
}

```

### Use your new component

```tsx
"use client"; // tells Next.js that this component can't be server-side rendered. If you're not using Next.js, you can remove it.
// [!code --:1]
import { JazzReactProvider, PasskeyAuthBasicUI } from "jazz-tools/react";
// [!code ++:1]
import { JazzReactProvider } from "jazz-tools/react";
import { Auth } from "./Auth.tsx";
import { JazzFestAccount } from "@/app/schema";

const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY;

export function JazzWrapper({ children }: { children: React.ReactNode }) {
return (
  <JazzReactProvider
    sync={{
      peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
    }}
    AccountSchema={JazzFestAccount}
  >
    {/* [!code ++:3] */}
    <Auth>{children}</Auth>
    {/* [!code --:3] */}
    <PasskeyAuthBasicUI appName="JazzFest">{children}</PasskeyAuthBasicUI>
  </JazzReactProvider>
);
}

```

### Show recovery key

Jazz allows you to generate a passphrase from a wordlist which can be used to log in to an account. This passphrase will work regardless of how the account was originally created (passkey, Clerk, BetterAuth, etc.). Each account will always have the same recovery key.

You can get started with a wordlist [from here](https://github.com/bitcoinjs/bip39/tree/master/src/wordlists). For example, you could save the `english.json` file in your project and format it as a JavaScript export.

**File name: wordlist.ts**

```ts
export const wordlist = [
  "abandon",
  // ... many more words
  "zoo"
];

```

We'll import this, and add a textarea into our auth component which will show the recovery key for the current user's account.

```tsx
import { useState } from "react";
// [!code --:1]
import { usePasskeyAuth } from "jazz-tools/react";
// [!code ++:2]
import { usePasskeyAuth, usePassphraseAuth } from "jazz-tools/react";
import { wordlist } from "./wordlist"; // or the path to your wordlist

export function Auth({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");

  const auth = usePasskeyAuth({
    // Must be inside the JazzProvider because the hook depends on an active Jazz context.
    appName: "JazzFest",
  });

  // [!code ++:1]
  const passphraseAuth = usePassphraseAuth({ wordlist }); // This should be inside the provider too

  return (
    <>
      <div>
        <button onClick={() => auth.logIn()}>Log in</button>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => auth.signUp(name)}>Sign up</button>
      </div>
      {auth.state === "signedIn" && (
        <>
          {children}
          {/* [!code ++:5]*/}
          <textarea readOnly value={passphraseAuth.passphrase} rows={5} />
        </>
      )}
    </>
  );
}

```

**Warning: Security Warning** 

This 'recovery key' is a method of authenticating into an account, and if compromised, it _cannot_ be changed! You should impress on your users the importance of keeping this key secret.

### Allow users to log in with the recovery key

Now you're displaying a recovery key to users, so we'll allow users to login using a saved recovery key by extending the Auth component a little further.

```tsx
import { useState } from "react";
import { usePasskeyAuth, usePassphraseAuth } from "jazz-tools/react";
import { wordlist } from "./wordlist"; // or the path to your wordlist

export function Auth({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");
  // [!code ++:1]
  const [passphraseInput, setPassphraseInput] = useState("");

  const auth = usePasskeyAuth({
    // Must be inside the JazzProvider because the hook depends on an active Jazz context.
    appName: "JazzFest",
  });

  const passphraseAuth = usePassphraseAuth({ wordlist }); // This should be inside the provider too

  return (
    <>
      <div>
        <button onClick={() => auth.logIn()}>Log in</button>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => auth.signUp(name)}>Sign up</button>
      </div>
      {auth.state === "signedIn" && (
        <>
          {children}
          <textarea readOnly value={passphraseAuth.passphrase} rows={5} />
        </>
      )}
      {/* [!code ++:8]*/}
      {auth.state !== "signedIn" && (
        <>
          <textarea
            onChange={(e) => setPassphraseInput(e.target.value)}
            rows={5}
          />
          <button onClick={() => passphraseAuth.logIn(passphraseInput)}>
            Sign In with Passphrase
          </button>
        </>
      )}
    </>
  );
}

```

**Info: Tip** 

Although we're presenting this as a 'recovery key' here, this key could also be used as the primary method of authenticating users into your app. You could even completely remove passkey support if you wanted.

**Congratulations! 🎉** You've added authentication to your app, allowing your users to log in from multiple devices, and you've added a recovery method, allowing users to make sure they never lose access to their account.

## Next steps

* Check out how to [use other types of authentication](/docs/key-features/authentication/overview#available-authentication-methods)
* Learn more about [sharing and collaboration](/docs/permissions-and-sharing/quickstart)
* Find out how to [use server workers](/docs/server-side/quickstart) to build more complex applications


### Authentication States
# Authentication States

Jazz provides three distinct authentication states that determine how users interact with your app: **Anonymous Authentication**, **Guest Mode**, and **Authenticated Account**.

## Anonymous Authentication

When a user loads a Jazz application for the first time, we create a new Account by generating keys and storing them locally:

* Users have full accounts with unique IDs
* Data persists between sessions on the same device
* Can be upgraded to a full account (passkey, passphrase, etc.)
* Data syncs across the network (if enabled)

## Authenticated Account

**Authenticated Account** provides full multi-device functionality:

* Persistent identity across multiple devices
* Full access to all application features
* Data can sync across all user devices
* Multiple authentication methods available

## Guest Mode

**Guest Mode** provides a completely accountless context:

* No persistent identity or account
* Only provides access to publicly readable content
* Cannot save or sync user-specific data
* Suitable for read-only access to public resources

## Detecting Authentication State

You can detect the current authentication state using `useAgent` and `useIsAuthenticated`.

```tsx
// This comes from your own implementation.
// See https://jazz.tools/docs/vanilla/project-setup for more
const { isAuthenticated } = authSecretStorage;

```

## Migrating data from anonymous to authenticated account

When a user signs up, their anonymous account is transparently upgraded to an authenticated account, preserving all their data.

However, if a user has been using your app anonymously and later logs in with an existing account, their anonymous account data would normally be discarded. To prevent data loss, you can use the `onAnonymousAccountDiscarded` handler.

This example from our [music player example app](https://github.com/garden-co/jazz/tree/main/examples/music-player) shows how to migrate data:

```ts
export async function onAnonymousAccountDiscarded(
  anonymousAccount: MusicaAccount,
) {
  const { root: anonymousAccountRoot } =
    await anonymousAccount.$jazz.ensureLoaded({
      resolve: {
        root: {
          rootPlaylist: {
            tracks: {
              $each: true,
            },
          },
        },
      },
    });

  const me = await MusicaAccount.getMe().$jazz.ensureLoaded({
    resolve: {
      root: {
        rootPlaylist: {
          tracks: true,
        },
      },
    },
  });

  for (const track of anonymousAccountRoot.rootPlaylist.tracks) {
    if (track.isExampleTrack) continue;

    const trackGroup = track.$jazz.owner;
    trackGroup.addMember(me, "admin");

    me.root.rootPlaylist.tracks.$jazz.push(track);
  }
}

```

To see how this works, try uploading a song in the [music player demo](https://music.demo.jazz.tools/) and then log in with an existing account.

## Provider Configuration for Authentication

You can configure how authentication states work in your app with the [JazzReactProvider](/docs/project-setup/providers/). The provider offers several options that impact authentication behavior:

* `guestMode`: Enable/disable Guest Mode
* `onAnonymousAccountDiscarded`: Handle data migration when switching accounts
* `sync.when`: Control when data synchronization happens
* `defaultProfileName`: Set default name for new user profiles

For detailed information on all provider options, see [Provider Configuration options](/docs/project-setup/providers/#additional-options).

## Controlling sync for different authentication states

You can control network sync with [Providers](/docs/project-setup/providers/) based on authentication state:

* `when: "always"`: Sync is enabled for both Anonymous Authentication and Authenticated Account
* `when: "signedUp"`: Sync is enabled when the user is authenticated
* `when: "never"`: Sync is disabled, content stays local

```tsx
// This comes from your own implementation.
// See https://jazz.tools/docs/vanilla/project-setup for more
const { me, logOut, authSecretStorage } = await createVanillaJazzApp({
  sync: {
    peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
    // Controls when sync is enabled for
    // both Anonymous Authentication and Authenticated Account
    when: "always", // or "signedUp" or "never"
  },
});

```

### Disable sync for Anonymous Authentication

You can disable network sync to make your app local-only under specific circumstances.

For example, you may want to give users with Anonymous Authentication the opportunity to try your app locally-only (incurring no sync traffic), then enable network sync only when the user is fully authenticated.

```tsx
const { me, logOut, authSecretStorage } = await createVanillaJazzApp({
  sync: {
    peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
    // This makes the app work in local mode when using Anonymous Authentication
    when: "signedUp",
  },
});

```

For more complex behaviours, you can manually control sync by statefully switching when between `"always"` and `"never"`.


### Passkey
# Passkey Authentication

Passkey authentication is fully local-first and the most secure of the auth methods that Jazz provides because keys are managed by the device/operating system itself.

## How it works

Passkey authentication is based on the [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web%5FAuthentication%5FAPI) and uses familiar FaceID/TouchID flows that users already know how to use.

## Key benefits

* **Most secure**: Keys are managed by the device/OS
* **User-friendly**: Uses familiar biometric verification (FaceID/TouchID)
* **Cross-device**: Works across devices with the same biometric authentication
* **No password management**: Users don't need to remember or store anything
* **Wide support**: Available in most modern browsers

## Implementation

Using passkeys in Jazz is as easy as this:

```tsx
export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [username, setUsername] = useState("");

  const auth = usePasskeyAuth({
    // Must be inside the JazzProvider!
    appName: "My super-cool web app",
  });

  if (auth.state === "signedIn") {
    // You can also use `useIsAuthenticated()`
    return <div>You are already signed in</div>;
  }

  const handleSignUp = async () => {
    await auth.signUp(username);
    onOpenChange(false);
  };

  const handleLogIn = async () => {
    await auth.logIn();
    onOpenChange(false);
  };

  return (
    <div>
      <button onClick={handleLogIn}>Log in</button>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign up</button>
    </div>
  );
}

```

## Examples

You can try passkey authentication using our [passkey example](https://passkey.demo.jazz.tools/) or the [music player demo](https://music.demo.jazz.tools/).

## When to use Passkeys

Passkeys are ideal when:

* Security is a top priority
* You want the most user-friendly authentication experience
* You're targeting modern browsers and devices
* You want to eliminate the risk of password-based attacks

## Limitations and considerations

* Requires hardware/OS support for biometric authentication
* Not supported in older browsers (see browser support below)
* Requires a fallback method for unsupported environments

### Browser Support

[Passkeys are supported in most modern browsers](https://caniuse.com/passkeys).

For older browsers, we recommend using [passphrase authentication](/docs/key-features/authentication/passphrase) as a fallback.

## Additional resources

For more information about the Web Authentication API and passkeys:

* [WebAuthn.io](https://webauthn.io/)
* [MDN Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web%5FAuthentication%5FAPI)


### Passphrase
# Passphrase Authentication

Passphrase authentication lets users log into any device using a recovery phrase consisting of multiple words (similar to cryptocurrency wallets). Users are responsible for storing this passphrase safely.

## How it works

When a user creates an account with passphrase authentication:

1. Jazz generates a unique recovery phrase derived from the user's cryptographic keys
2. This phrase consists of words from a wordlist
3. Users save this phrase and enter it when logging in on new devices

You can use one of the ready-to-use wordlists from the [BIP39 repository](https://github.com/bitcoinjs/bip39/tree/a7ecbfe2e60d0214ce17163d610cad9f7b23140c/src/wordlists) or create your own. If you do decide to create your own wordlist, it's recommended to use at least 2048 unique words (or some higher power of two).

## Key benefits

* **Portable**: Works across any device, even without browser or OS support
* **User-controlled**: User manages their authentication phrase
* **Flexible**: Works with any wordlist you choose
* **Offline capable**: No external dependencies

## Implementation

You can implement passphrase authentication in your application quickly and easily:

```ts
import { PassphraseAuth } from "jazz-tools";
import { wordlist } from "./wordlist";
const crypto = me.$jazz.localNode.crypto;

// `authenticate` and `register` are methods provided by the Context Manager, and should be returned from your `createVanillaJazzApp` function
const auth = new PassphraseAuth(
crypto,
authenticate,
register,
authSecretStorage,
wordlist,
);

```

## Examples

You can see passphrase authentication in our [passphrase example](https://passphrase.demo.jazz.tools/) or the [todo list demo](https://todo.demo.jazz.tools/).

## When to use Passphrases

Passphrase authentication is ideal when:

* You need to support older browsers without WebAuthn capabilities
* Your users need to access the app on many different devices
* You want a fallback authentication method alongside passkeys

## Limitations and considerations

* **User responsibility**: Users must securely store their passphrase
* **Recovery concerns**: If a user loses their passphrase, they cannot recover their account
* **Security risk**: Anyone with the passphrase can access the account
* **User experience**: Requires users to enter a potentially long phrase

Make sure to emphasize to your users:

1. Store the passphrase in a secure location (password manager, written down in a safe place)
2. The passphrase is the only way to recover their account
3. Anyone with the passphrase can access the account


### Clerk


### Better Auth
# Better Auth authentication

[Better Auth](https://better-auth.com/) is a self-hosted, framework-agnostic authentication and authorisation framework for TypeScript.

You can integrate Better Auth with your Jazz app, allowing your Jazz user's account keys to be saved with the corresponding Better Auth user.

## How it works

When using Better Auth authentication:

1. Users sign up or sign in through Better Auth's authentication system
2. Jazz securely stores the user's account keys with Better Auth
3. When logging in, Jazz retrieves these keys from Better Auth
4. Once authenticated, users can work offline with full Jazz functionality

This authentication method is not fully local-first, as login and signup need to be done online, but once authenticated, users can use all of Jazz's features without needing to be online.

## Authentication methods and plugins

Better Auth supports several authentication methods and plugins. The Jazz plugin has not been tested with all of them yet. Here is the compatibility matrix:

| Better Auth method/plugin | Jazz plugin |
| ------------------------- | ----------- |
| Email/Password            | ✅           |
| Social Providers          | ✅           |
| Username                  | ❓           |
| Anonymous                 | ❓           |
| Phone Number              | ❓           |
| Magic Link                | ❓           |
| Email OTP                 | ✅           |
| Passkey                   | ❓           |
| One Tap                   | ❓           |

✅: tested and working ❓: not tested yet ❌: not supported

## Getting started

First of all, follow the [Better Auth documentation](https://www.better-auth.com/docs/installation) to install Better Auth:

* Install the dependency and set env variables
* Create the betterAuth instance in the common `auth.ts` file, using the database adapter you want.
* Set up the authentication methods you want to use
* Mount the handler in the API route
* Create the client instance in the common `auth-client.ts` file

The `jazz-tools/better-auth/auth` plugin provides both server-side and client-side integration for Better Auth with Jazz. Here's how to set it up:

### Server Setup

Add the `jazzPlugin` to the Better Auth instance:

**File name: src/lib/auth.ts**

```ts
import { betterAuth } from "better-auth";
import { jazzPlugin } from "jazz-tools/better-auth/auth/server";

// Your Better Auth server configuration
export const auth = betterAuth({
  // Add the Jazz plugin
  plugins: [
    jazzPlugin(),
    // other server plugins
  ],

  // rest of the Better Auth configuration
  // like database, email/password authentication, social providers, etc.
});

export const authWithHooks = betterAuth({
  plugins: [jazzPlugin()],
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          // Here we can send a welcome email to the user
          console.log("User created with Jazz Account ID:", user.accountID);
        },
      },
    },
  },
});

```

Now run [migrations](https://www.better-auth.com/docs/concepts/database#running-migrations) to add the new fields to the users table.

**Warning: Note** 

The server-side plugin intercepts the custom header `x-jazz-auth` sent by client-side plugin. If server is behind a proxy, the header must be forwarded. If the server runs on a different origin than the client, the header must be allowed for cross-origin requests.

### Client Setup

Create the Better Auth client with the Jazz plugin:

**File name: src/lib/auth-client.ts**

```ts
"use client";

import { createAuthClient } from "better-auth/client";
import { jazzPluginClient } from "jazz-tools/better-auth/auth/client";

export const betterAuthClient = createAuthClient({
  plugins: [
    jazzPluginClient(),
    // other client plugins
  ],
});

```

Set JazzContext and AuthSecretStorage in the Better Auth client:

```ts
import { betterAuthClient } from "./auth-client";
// Get these from your own implementation
import { getAuthStorage, getJazzContext } from "./jazz-utils";
const jazzContext = getJazzContext();
const authSecretStorage = getAuthStorage();

betterAuthClient.jazz.setJazzContext(jazzContext);
betterAuthClient.jazz.setAuthSecretStorage(authSecretStorage);

```

## Authentication methods

The Jazz plugin intercepts the Better Auth client's calls, so you can use the Better Auth [methods](https://www.better-auth.com/docs/basic-usage) as usual.

Here is how to sign up with email and password, and transform an anonymous Jazz account into a logged in user authenticated by Better Auth:

```ts
const me = Account.getMe();
await betterAuthClient.signUp.email(
  {
    email: "email@example.com",
    password: "password",
    name: "John Doe",
  },
  {
    onSuccess: async () => {
      // Don't forget to update the profile's name. It's not done automatically.
      if (me.profile.$isLoaded) {
        me.profile.$jazz.set("name", "John Doe");
      }
    },
  },
);

```

You can then use the `signIn` and `signOut` methods on the `betterAuthClient`:

```ts
await betterAuthClient.signIn.email({
  email: "email@example.com",
  password: "password",
});

await betterAuthClient.signOut();

```

## Authentication states

Although Better Auth is not fully local-first, the Jazz client plugin tries to keep Jazz's authentication state in sync with Better Auth's. The best practice to check if the user is authenticated is using Jazz's methods [as described here](/docs/key-features/authentication/authentication-states#detecting-authentication-state).

You can use Better Auth's [native methods](https://www.better-auth.com/docs/basic-usage#session) if you need to check the Better Auth state directly.

## Server-side hooks

Better Auth provides [database hooks](https://www.better-auth.com/docs/reference/options#databasehooks) to run code when things happen. When using the Jazz, the user's Jazz account ID is always available in the `user` object. This means you can access it anywhere in Better Auth hooks.

```ts
export const authWithHooks = betterAuth({
  plugins: [jazzPlugin()],
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          // Here we can send a welcome email to the user
          console.log("User created with Jazz Account ID:", user.accountID);
        },
      },
    },
  },
});

```


### Better Auth Database Adapter
# Jazz database adapter for Better Auth

The package `jazz-tools/better-auth/database-adapter` is a database adapter for Better Auth based on Jazz. Better Auth's data will be stored in CoValues encrypted by [Server Worker](/docs/server-side/setup), synced on our distributed [cloud infrastructure](/cloud).

## Getting started

1. Install and configure [Better Auth](https://www.better-auth.com/docs/installation)
2. Install Jazz package `pnpm jazz-tools`
3. Generate a [worker's credentials](/docs/server-side/setup#generating-credentials)

```bash
npx jazz-run account create --name "Better Auth Server Worker"

```

**Info: Security** 

Although all workers have the same capabilities, we recommend to use different workers for different purposes. As it will store user's credentials, the best practice is to keep it isolated from other workers.

1. Setup the database adapter on Better Auth server instance.

```ts
import { betterAuth } from "better-auth";
import { JazzBetterAuthDatabaseAdapter } from "jazz-tools/better-auth/database-adapter";
const apiKey = process.env.JAZZ_API_KEY;

const auth = betterAuth({
database: JazzBetterAuthDatabaseAdapter({
  syncServer: `wss://cloud.jazz.tools/?key=${apiKey}`,
  accountID: "auth-worker-account-id",
  accountSecret: "your-worker-account-secret",
}),

// other Better Auth settings
});

```

1. You're ready to use Better Auth features without managing any database by yourself!

## How it works

The adapter automatically creates Jazz schemas from Better Auth's database schema, even if not all the SQL-like features are supported yet. The database is defined as a CoMap with two properties: `group` and `tables`. The first one contains the master Group that will own all the tables; the second one is a CoMap with table names as keys and data as values.

Internally it uses specialized repository for known models like `User`, `Session` and `Verification`, to add indexes and boost performances on common operations.

## How to access the database

The easiest way to access the database is using the same Server Worker's credentials and access the table we're looking for.

```ts
import { startWorker } from "jazz-tools/worker";
import { co, z } from "jazz-tools";
const apiKey = process.env.JAZZ_API_KEY;

const worker1 = await startWorker({
  syncServer: `wss://cloud.jazz.tools/?key=${apiKey}`,
  accountID: process.env.WORKER_ACCOUNT_ID,
  accountSecret: process.env.WORKER_ACCOUNT_SECRET,
});

const DatabaseRoot = co.map({
  tables: co.map({
    user: co.list(
      co.map({
        name: z.string(),
        email: z.string(),
      }),
    ),
  }),
});

const db = await DatabaseRoot.loadUnique(
  "better-auth-root",
  process.env.WORKER_ACCOUNT_ID!,
  {
    resolve: {
      tables: {
        user: {
          $each: true,
        },
      },
    },
  },
);

if (db.$isLoaded) {
  console.log(db.tables.user);
}

```

## Rotating the worker's credentials

If you need to change the worker, you can create a new one and add it to the master Group.

```ts
import { Account, Group, co } from "jazz-tools";
import { startWorker } from "jazz-tools/worker";
const apiKey = process.env.JAZZ_API_KEY;

// Start the main worker and fetch database reference
const { worker } = await startWorker({
  syncServer: `wss://cloud.jazz.tools/?key=${apiKey}`,
  accountID: process.env.WORKER_ACCOUNT_ID,
  accountSecret: process.env.WORKER_ACCOUNT_SECRET,
});

const DatabaseRoot = co.map({
  group: Group,
  tables: co.map({}),
});

const db = await DatabaseRoot.loadUnique(
  "better-auth-root",
  process.env.WORKER_ACCOUNT_ID!,
  {
    loadAs: worker,
    resolve: {
      group: true,
      tables: true,
    },
  },
);

// Load the new worker account
const newWorkerRef = await co
  .account()
  .load(process.env.NEW_WORKER_ACCOUNT_ID!);

if (db.$isLoaded && newWorkerRef.$isLoaded) {
  // Add the new worker to the group as admin
  db.group.addMember(newWorkerRef, "admin");
  await db.group.$jazz.waitForSync();

  // Now the new worker can access the tables
  const { worker: newWorker } = await startWorker({
    syncServer: `wss://cloud.jazz.tools/?key=${apiKey}`,
    accountID: process.env.NEW_WORKER_ACCOUNT_ID,
    accountSecret: process.env.NEW_WORKER_ACCOUNT_SECRET,
  });

  // Create the database root on the new worker with the same group's and tables' references
  await DatabaseRoot.upsertUnique({
    unique: "better-auth-root",
    value: {
      group: db.group,
      tables: db.tables,
    },
    owner: newWorker,
  });

  // Now the new worker can be used for the Database Adapter.

  // Don't forget to remove the old worker from the group
  db.group.removeMember(worker);
}

```

**Warning: Security** 

Rotating keys means that data stored from that point forward will be encrypted with the new key, but the old worker's secret can still read data written up until the rotation. Read more about encryption in [Server Worker](/docs/reference/encryption).

## Compatibility

The adapter generates Jazz schemas reading from Better Auth's database schema, so it should be compatible with any plugin / user's code that introduces new tables or extends the existing ones.

So far, the adapter has been tested with **Better Auth v1.3.7** with the following plugins:

| Plugin/Feature                                                                          | Compatibility |
| --------------------------------------------------------------------------------------- | ------------- |
| [Email & Password auth](https://www.better-auth.com/docs/authentication/email-password) | ✅             |
| [Social Provider auth](https://www.better-auth.com/docs/authentication/github)          | ✅             |
| [Email OTP](https://www.better-auth.com/docs/plugins/email-otp)                         | ✅             |

More features and plugins will be tested in the future.


### Overview
# Groups as permission scopes

Every CoValue has an owner, which can be a `Group` or an `Account`.

You can use a `Group` to grant access to a CoValue to **multiple users**. These users can have different roles, such as "writer", "reader" or "admin".

CoValues owned by an Account can only be accessed by that Account. Additional collaborators cannot be added, and the ownership cannot be transferred to another Account. This makes account ownership very rigid.

Creating a Group for every new CoValue is a best practice, even if the Group only has a single user in it (this is the default behavior when creating a CoValue with no explicit owner).

**Info:** 

While creating CoValues with Accounts as owners is still technically possible for backwards compatibility, it will be removed in a future release.

## Role Matrix

| Role                               | admin        | manager              | writer          | writeOnly         | reader |
| ---------------------------------- | ------------ | -------------------- | --------------- | ----------------- | ------ |
| Summary                            | Full control | Delegated management | Standard writer | Blind submissions | Viewer |
| Can add admins\*                   | ✅            | ❌                    | ❌               | ❌                 | ❌      |
| Can add/remove managers            | ✅            | ❌                    | ❌               | ❌                 | ❌      |
| Can add/remove readers and writers | ✅            | ✅                    | ❌               | ❌                 | ❌      |
| Can write                          | ✅            | ✅                    | ✅               | ✅\*\*             | ❌      |
| Can read                           | ✅            | ✅                    | ✅               | ❌\*\*\*           | ✅      |

\* `admin` users cannot be removed by anyone else, they must leave the group themselves.

\*\* `writeOnly` users can only create and edit their own updates/submissions.

\*\*\* `writeOnly` cannot read updates from other users.

## Creating a Group

Here's how you can create a `Group`.

```ts
import { Group } from "jazz-tools";

const group = Group.create();

```

The `Group` itself is a CoValue, and whoever owns it is the initial admin.

You typically add members using [public sharing](/docs/permissions-and-sharing/sharing#public-sharing) or [invites](/docs/permissions-and-sharing/sharing#invites). But if you already know their ID, you can add them directly (see below).

## Adding group members by ID

You can add group members by ID by using `co.account().load` and `Group.addMember`.

```tsx
import { co } from "jazz-tools";
const bob = await co.account().load(bobsId);

if (bob.$isLoaded) {
  group.addMember(bob, "writer");
}

```

## Changing a member's role

To change a member's role, use the `addMember` method.

```ts
if (bob.$isLoaded) {
  group.addMember(bob, "reader");
}

```

Bob just went from a writer to a reader.

**Note:** only admins and managers can change a member's role.

## Removing a member

To remove a member, use the `removeMember` method.

```ts
if (bob.$isLoaded) {
  group.removeMember(bob);
}

```

Rules:

* All roles can remove themselves
* Admins can remove all roles (except other admins)
* Managers can remove users with less privileged roles (writer, writeOnly, reader)

## Getting the Group of an existing CoValue

You can get the group of an existing CoValue by using `coValue.$jazz.owner`.

```ts
const owningGroup = existingCoValue.$jazz.owner;
const newValue = MyCoMap.create({ color: "red" }, { owner: group });

```

## Checking the permissions

You can check the permissions of an account on a CoValue by using the `canRead`, `canWrite`, `canManage` and `canAdmin` methods.

```ts
const red = MyCoMap.create({ color: "red" });
const me = co.account().getMe();

if (me.canAdmin(red)) {
  console.log("I can add users of any role");
} else if (me.canManage(red)) {
  console.log("I can share value with others");
} else if (me.canWrite(red)) {
  console.log("I can edit value");
} else if (me.canRead(red)) {
  console.log("I can view value");
} else {
  console.log("I cannot access value");
}

```

To check the permissions of another account, you need to load it first:

```ts
const blue = MyCoMap.create({ color: "blue" });
const alice = await co.account().load(alicesId);

if (alice.$isLoaded) {
  if (alice.canAdmin(blue)) {
    console.log("Alice can share value with others");
  } else if (alice.canWrite(blue)) {
    console.log("Alice can edit value");
  } else if (alice.canRead(blue)) {
    console.log("Alice can view value");
  } else {
    console.log("Alice cannot access value");
  }
}

```


### Quickstart
# Add Collaboration to your App

This guide will take your festival app to the next level by showing you how to use invite links to collaborate with others.

**Info:** 

If you haven't gone through the [front-end Quickstart](/docs/quickstart), you might find this guide a bit confusing.

## Understanding Groups

Jazz uses Groups to manage how users are able to access data. Each group member normally has one of three primary 'roles': `reader`, `writer`, or `admin`.

You can add users to groups manually, or you can use invite links to allow people to join groups themselves. Invite links work even for unauthenticated users!

## Create an invite link

Let's create an invite link that others can use to access our data. We'll create an invite link that allows others to make updates to our festival.

When we create a link, we can choose what level of permission to grant. Here, we want others to be able to collaborate, so we'll grant `writer` permissions.

```tsx
"use client";
// [!code --:1]
import { useAccount } from "jazz-tools/react";
// [!code ++:1]
import { createInviteLink, useAccount } from "jazz-tools/react";
// [!code ++:1]
import { useState } from "react";
import { JazzFestAccount } from "@/app/schema";

export function Festival() {
  // [!code ++:1]
  const [inviteLink, setInviteLink] = useState<string>("");
  const me = useAccount(JazzFestAccount, {
    resolve: { root: { myFestival: { $each: true } } },
  });
  if (!me.$isLoaded) return null;
  // [!code ++:4]
  const inviteLinkClickHandler = () => {
    const link = createInviteLink(me.root.myFestival, "writer");
    setInviteLink(link);
  };
  return (
    // [!code ++:1]
    <>
      <ul>
        {me.root.myFestival.map((band) => (
          <li key={band.$jazz.id}>{band.name}</li>
        ))}
      </ul>
      {/* [!code ++:5] */}
      <input type="text" value={inviteLink} readOnly />
      <button onClick={inviteLinkClickHandler}>Create Invite Link</button>
    </>
  );
}

```

## Accept an invite

Now we need to set up a way for Jazz to handle the links for the users who are following them.

Jazz provides a handler which we can add to our `Festival` component to accept the invite. This will automatically fire when there's an invite link in the URL, and grant the user the right accesses.

```tsx
"use client";
import { createInviteLink, useAccount } from "jazz-tools/react";
// [!code ++:2]
import {
  createInviteLink,
  useAcceptInvite,
  useAccount,
} from "jazz-tools/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// [!code --:1]
import { JazzFestAccount } from "@/app/schema";
// [!code ++:2]
// We need to alias the schema because our component is also named Festival
import { Festival as FestivalSchema, JazzFestAccount } from "@/app/schema";

export function Festival() {
  const [inviteLink, setInviteLink] = useState<string>("");
  const me = useAccount(JazzFestAccount, {
    resolve: { root: { myFestival: { $each: true } } },
  });
  // [!code ++:7]
  const router = useRouter();
  useAcceptInvite({
    invitedObjectSchema: FestivalSchema,
    onAccept: (festivalID: string) => {
      router.push(`/festival/${festivalID}`);
    },
  });
  if (!me.$isLoaded) return null;

  const inviteLinkClickHandler = () => {
    const link = createInviteLink(me.root.myFestival, "writer");
    setInviteLink(link);
  };
  return (
    <>
      <ul>
        {me.root.myFestival.map((band) => (
          <li key={band.$jazz.id}>{band.name}</li>
        ))}
      </ul>
      <input type="text" value={inviteLink} readOnly />
      <button onClick={inviteLinkClickHandler}>Create Invite Link</button>
    </>
  );
}

```

## Create the festival page

Now we need to create the festival page, so that we can view other people's festivals and collaborate with them.

### Update our Festival component

We're going to continue updating our existing `Festival` component so that it can optionally take a prop for the festival ID.

```tsx
"use client";
import {
  createInviteLink,
  useAcceptInvite,
  useAccount,
  // [!code ++:1]
  useCoState,
} from "jazz-tools/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// We need to alias the schema because our component is also named Festival
import { Festival as FestivalSchema, JazzFestAccount } from "@/app/schema";

// [!code ++:1]
export function Festival({ id }: { id?: string }) {
  const [inviteLink, setInviteLink] = useState<string>("");
  const me = useAccount(JazzFestAccount, {
    resolve: { root: { myFestival: true } },
  });
  const router = useRouter();
  useAcceptInvite({
    invitedObjectSchema: FestivalSchema,
    onAccept: (festivalID: string) => {
      router.push(`/festival/${festivalID}`);
    },
  });
  // [!code ++:2]
  const festivalId =
    id ?? (me.$isLoaded ? me.root.myFestival.$jazz.id : undefined);
  const festival = useCoState(FestivalSchema, festivalId);
  // [!code --:1]
  if (!me.$isLoaded) return null;
  // [!code ++:1]
  if (!festival.$isLoaded) return null;
  const inviteLinkClickHandler = () => {
    // [!code --:1]
    const link = createInviteLink(me.root.myFestival, "writer");
    // [!code ++:1]
    const link = createInviteLink(festival, "writer");
    setInviteLink(link);
  };
  return (
    <>
      <ul>
        {/* [!code --:3] */}
        {me.root.myFestival.map((band) => {
          return band.$isLoaded && <li key={band.$jazz.id}>{band.name}</li>;
        })}
        {/* [!code ++:3] */}
        {festival.map(
          (band) => band.$isLoaded && <li key={band.$jazz.id}>{band.name}</li>,
        )}
      </ul>
      {me.canAdmin(festival) && (
        <>
          <input type="text" value={inviteLink} readOnly />
          <button type="button" onClick={inviteLinkClickHandler}>
            Create Invite Link
          </button>
        </>
      )}
    </>
  );
}

```

### Update our New Band component

We'll also update our `NewBand` component so that it can take a prop for the festival ID, which will make it reusable on our home page and the new festival page.

```tsx
"use client";
// [!code --:2]
import { useAccount } from "jazz-tools/react";
import { JazzFestAccount } from "@/app/schema";
// [!code ++:3]
import { useAccount, useCoState } from "jazz-tools/react";
import { useState } from "react";
import { JazzFestAccount, Festival } from "@/app/schema";

// [!code ++:1]
export function NewBand({ id }: { id?: string }) {
  const me = useAccount(JazzFestAccount, {
    resolve: { root: { myFestival: true } },
  });
  const [name, setName] = useState("");

  // [!code ++:2]
  const festivalId =
    id ??
    (me.$isLoaded && me.root.$isLoaded
      ? me.root.myFestival.$jazz.id
      : undefined);
  const festival = useCoState(Festival, festivalId);

  const handleSave = () => {
    // [!code --:2]
    if (!me.$isLoaded) return;
    me.root.myFestival.$jazz.push({ name });
    // [!code ++:2]
    if (!festival.$isLoaded) return;
    festival.$jazz.push({ name });
    setName("");
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        placeholder="Band name"
        onChange={(e) => setName(e.target.value)}
      />
      <button type="button" onClick={handleSave}>
        Add
      </button>
    </div>
  );
}

```

### Create a route

```tsx
"use client";
import { use } from "react";
import { Festival } from "$lib/Festival";
import { NewBand } from "@/app/components/NewBand";

export default function FestivalPage(props: {
  params: Promise<{ festivalId: string }>;
}) {
  const { festivalId } = use(props.params);

  return (
    <main>
      <h1>🎪 Festival {festivalId}</h1>
      <Festival id={festivalId} />
      <NewBand id={festivalId} />
    </main>
  );
}

```

## Put it all together

Now we can test it out by inviting someone to collaborate on our festival.

1. Open your app and sign in.
2. Open a new incognito window and sign up with a new passkey.
3. From your first browser tab, create an invite link for the festival.
4. You should be able to invite someone to collaborate on the festival.
5. Paste the invite link into the incognito window. You should be able to add bands to the festival!

**Congratulations! 🎉** You've added public sharing to your app! You've learned what groups are, and how Jazz manages permissions, as well as how to invite others to collaborate on data in your app with you.

## Next steps

* Learn how to [authenticate users](/docs/key-features/authentication/quickstart) so you can access data wherever you are.
* Discover how you can use [groups as members of other groups](/docs/permissions-and-sharing/cascading-permissions) to build advanced permissions structures.
* Find out how to [use server workers](/docs/server-side/quickstart) to build more complex applications


### Sharing
# Public sharing and invites

## Public sharing

You can share CoValues publicly by setting the `owner` to a `Group`, and granting access to "everyone".

```ts
const group = Group.create();
group.addMember("everyone", "writer");

```

You can also use `makePublic(role)` alias to grant access to everyone with a specific role (defaults to `reader`).

```ts
const group = Group.create();
  group.addMember("everyone", "writer"); // [!code --]
  group.makePublic("writer"); // [!code ++]
  // group.makePublic(); // Defaults to "reader" access

```

You can also [add members by Account ID](/docs/permissions-and-sharing/overview#adding-group-members-by-id).

## Invites

You can grant users access to a CoValue by sending them an invite link.

```tsx
import { createInviteLink } from "jazz-tools";

const inviteLink = createInviteLink(
organization,
"writer",
"https://example.com/", // Base URL for the invite link
);

```

It generates a URL that looks like `.../invite/[CoValue ID]/[inviteSecret]`

In your app, you need to handle this route, and let the user accept the invitation, as done [here](https://github.com/garden-co/jazz/tree/main/examples/todo/src/2%5Fmain.tsx).

```ts
import { consumeInviteLink } from "jazz-tools";

consumeInviteLink({
  inviteURL: inviteLink,
  invitedObjectSchema: Organization, // Pass the schema for the invited object
}).then(async (invitedObject) => {
  if (!invitedObject) throw new Error("Failed to consume invite link");
  const organization = await Organization.load(invitedObject?.valueID);
  me.root.organizations.$jazz.push(organization);
});

```

You can accept an invitation programmatically by using the `acceptInvite` method on an account.

Pass the ID of the CoValue you're being invited to, the secret from the invite link, and the schema of the CoValue.

```ts
await account.acceptInvite(organizationId, inviteSecret, Organization);

```

### Invite Secrets

The invite links generated by Jazz are convenient ways of handling invites.

In case you would prefer more direct control over the invite, you can create an invite to a `Group` using `Group.createInvite(id, role)` or `group.$jazz.createInvite(role)`.

This will generate a string starting with `inviteSecret_`. You can then accept this invite using `acceptInvite`, with the group ID as the first argument, and the invite secret as the second.

```ts
const groupToInviteTo = Group.create();
const readerInvite = groupToInviteTo.$jazz.createInvite("reader");
// `inviteSecret_`

await account.acceptInvite(group.$jazz.id, readerInvite);

```

**Warning: Security Note** 

**Invites do not expire and cannot be revoked.** If you choose to generate your own secrets in this way, take care that they are not shared in plain text over an insecure channel.

One particularly tempting mistake is passing the secret as a route parameter or a query. However, this will cause your secret to appear in server logs. You should only ever use fragment identifiers (i.e. parts after the hash in the URL) to share secrets, as these are not sent to the server (see the `createInviteLink` implementation).

### Requesting Invites

To allow a non-group member to request an invitation to a group you can use the `writeOnly` role. This means that users only have write access to a specific requests list (they can't read other requests). However, Administrators can review and approve these requests.

Create the data models.

```ts
const JoinRequest = co.map({
  account: co.account(),
  status: z.literal(["pending", "approved", "rejected"]),
});

const RequestsList = co.list(JoinRequest);

```

Set up the request system with appropriate access controls.

```ts
function createRequestsToJoin() {
  const requestsGroup = Group.create();
  requestsGroup.addMember("everyone", "writeOnly");

  return RequestsList.create([], requestsGroup);
}

async function sendJoinRequest(
  requestsList: co.loaded<typeof RequestsList>,
  account: Account,
) {
  const request = JoinRequest.create(
    {
      account,
      status: "pending",
    },
    requestsList.$jazz.owner, // Inherit the access controls of the requestsList
  );

  requestsList.$jazz.push(request);

  return request;
}

```

Using the write-only access users can submit requests that only administrators can review and approve.

```ts
async function approveJoinRequest(
  joinRequest: co.loaded<typeof JoinRequest, { account: true }>,
  targetGroup: Group,
) {
  const account = await co.account().load(joinRequest.$jazz.refs.account.id);

  if (account.$isLoaded) {
    targetGroup.addMember(account, "reader");
    joinRequest.$jazz.set("status", "approved");

    return true;
  } else {
    return false;
  }
}

```


### Cascading Permissions
# Groups as members

Groups can be added to other groups using the `addMember` method.

When a group is added as a member of another group, members of the added group will become part of the containing group.

## Basic usage

Here's how to add a group as a member of another group:

```ts
const playlistGroup = Group.create();
const trackGroup = Group.create();

// Tracks are now visible to the members of playlist
trackGroup.addMember(playlistGroup);

```

When you add groups as members:

* Members of the added group become members of the container group
* Their roles are inherited (with some exceptions, see [below](#the-rules-of-role-inheritance))
* Revoking access from the member group also removes its access to the container group

## Levels of inheritance

Adding a group as a member of another is not limited in depth:

```ts
const grandParentGroup = Group.create();
const parentGroup = Group.create();
const childGroup = Group.create();

childGroup.addMember(parentGroup);
parentGroup.addMember(grandParentGroup);

```

Members of the grandparent group will get access to all descendant groups based on their roles.

## Roles

### The rules of role inheritance

If the account is already a member of the container group, it will get the more permissive role:

```ts
const addedGroup = Group.create();
addedGroup.addMember(bob, "reader");

const containingGroup = Group.create();
addedGroup.addMember(bob, "writer");
containingGroup.addMember(addedGroup);

// Bob stays a writer because his role is higher
// than the inherited reader role.

```

When adding a group to another group, only admin, writer and reader roles are inherited:

```ts
const addedGroup = Group.create();
  containingGroup.addMember(bob, "writeOnly");

  const mainGroup = Group.create();
  mainGroup.addMember(containingGroup);

```

### Overriding the added group's roles

In some cases you might want to inherit all members from an added group but override their roles to the same specific role in the containing group. You can do so by passing an "override role" as a second argument to `addMember`:

```ts
const organizationGroup = Group.create();
organizationGroup.addMember(bob, "admin");

const billingGroup = Group.create();

// This way the members of the organization
// can only read the billing data
billingGroup.addMember(organizationGroup, "reader");
```ts index.ts#OverrideContainers

```

### Permission changes

When you remove a member from an added group, they automatically lose access to all containing groups. We handle key rotation automatically to ensure security.

```ts
// Remove member from added group
addedGroup.removeMember(bob);

// Bob loses access to both groups.
// If Bob was also a member of the containing group,
// he wouldn't have lost access.

```

## Removing groups from other groups

You can remove a group from another group by using the `removeMember` method:

```ts
const addedGroup = Group.create();
  const containingGroup = Group.create();

  containingGroup.addMember(addedGroup);

  // Revoke the extension
  containingGroup.removeMember(addedGroup);

```

## Getting all added groups

You can get all of the groups added to a group by calling the `getParentGroups` method:

```ts
const containingGroup = Group.create();
  const addedGroup = Group.create();
  containingGroup.addMember(addedGroup);

  console.log(containingGroup.getParentGroups()); // [addedGroup]

```

## Ownership on implicit CoValue creation

When creating CoValues that contain other CoValues (or updating references to CoValues) using plain JSON objects, Jazz not only creates the necessary CoValues automatically but it will also manage their group ownership.

```ts
const Task = co.plainText();
const Column = co.list(Task);
const Board = co.map({
  title: z.string(),
  columns: co.list(Column),
});

const board = Board.create({
  title: "My board",
  columns: [
    ["Task 1.1", "Task 1.2"],
    ["Task 2.1", "Task 2.2"],
  ],
});

```

For each created column and task CoValue, Jazz also creates a new group as its owner and adds the referencing CoValue's owner as a member of that group. This means permissions for nested CoValues are inherited from the CoValue that references them, but can also be modified independently for each CoValue if needed.

```ts
const writeAccess = Group.create();
writeAccess.addMember(bob, "writer");

// Give Bob write access to the board, columns and tasks
const boardWithGranularPermissions = Board.create(
  {
    title: "My board",
    columns: [
      ["Task 1.1", "Task 1.2"],
      ["Task 2.1", "Task 2.2"],
    ],
  },
  writeAccess,
);

// Give Alice read access to one specific task
const task = boardWithGranularPermissions.columns[0][0];
const taskGroup = task.$jazz.owner;
taskGroup.addMember(alice, "reader");

```

If you prefer to manage permissions differently, you can always create CoValues explicitly:

```ts
const writeAccess = Group.create();
writeAccess.addMember(bob, "writer");
const readAccess = Group.create();
readAccess.addMember(bob, "reader");

// Give Bob read access to the board and write access to the columns and tasks
const boardWithExplicitPermissions = Board.create(
  {
    title: "My board",
    columns: co.list(Column).create(
      [
        ["Task 1.1", "Task 1.2"],
        ["Task 2.1", "Task 2.2"],
      ],
      writeAccess,
    ),
  },
  readAccess,
);

```

## Example: Team Hierarchy

Here's a practical example of using group inheritance for team permissions:

```ts
// Company-wide group
const companyGroup = Group.create();
companyGroup.addMember(CEO, "admin");

// Team group with elevated permissions
const teamGroup = Group.create();
teamGroup.addMember(companyGroup); // Inherits company-wide access
teamGroup.addMember(teamLead, "admin");
teamGroup.addMember(developer, "writer");

// Project group with specific permissions
const projectGroup = Group.create();
projectGroup.addMember(teamGroup); // Inherits team permissions
projectGroup.addMember(client, "reader"); // Client can only read project items

```

This creates a hierarchy where:

* The CEO has admin access to everything
* Team members get writer access to team and project content
* Team leads get admin access to team and project content
* The client can only read project content


### Version control
# Version Control

Jazz provides built-in version control through branching and merging, allowing multiple users to work on the same resource in isolation and merge their changes when they are ready.

This enables the design of new editing workflows where users (or agents!) can create branches, make changes, and merge them back to the main version.

**Info:** 

**Important:** Version control is currently unstable and we may ship breaking changes in patch releases.

## Working with branches

### Creating Branches

To create a branch, use the `unstable_branch` option when loading a CoValue:

```ts
const branch = await Project.load(projectId, {
  unstable_branch: { name: "feature-branch" },
});

```

You can also include nested CoValues in your branch by using a [resolve query](/docs/core-concepts/subscription-and-loading#resolve-queries).

You are in control of how nested CoValues are included in your branch. When you specify the CoValue to branch, any nested CoValues specified in a `resolve` query will also be branched. Nested CoValues _not_ specified in your resolve query will not be branched.

In order to access branched nested CoValues, you should access them in the same way you would normally access a deeply loaded property, and all operations will work within the branch context.

**Info:** 

In case you create a separate reference to a nested CoValue (for example by loading it by its ID), or you use `.$jazz.ensureLoaded()` or `.$jazz.subscribe()`, you will need to specify the branch you wish to load.

### Making Changes

Once you have a branch, you can make changes just as you would with the original CoValue:

```tsx
function EditProject({
  projectId,
  currentBranchName,
}: {
  projectId: ID<typeof Project>;
  currentBranchName: string;
}) {
  const project = useCoState(Project, projectId, {
    resolve: {
      tasks: { $each: true },
    },
    unstable_branch: {
      name: currentBranchName,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Won't be visible on main until merged
    project.$isLoaded && project.$jazz.set("title", e.target.value);
  };

  const handleTaskTitleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const task = project.$isLoaded && project.tasks[index];

    // The task is also part of the branch because we used the `resolve` option
    // with `tasks: { $each: true }`
    // so the changes won't be visible on main until merged
    task && task.$jazz.set("title", e.target.value);
  };

  return <form onSubmit={handleSave}>{/* Edit form fields */}</form>;
}

```

### Account & Group

Branching does not bring isolation on Account and Group CoValues.

This means that, adding a member on a branched Group will also add the member to the main Group.

```ts
const featureBranch = await Project.load(projectId, {
  unstable_branch: { name: "feature-branch" },
});
featureBranch.$isLoaded &&
  featureBranch.$jazz.owner.addMember(member, "writer"); // Will also add the member to the main Group

```

If you are modifying an account, be aware that replacing the root or profile will also modify the main account (although updating the properties will happen on the branch).

```tsx
const me = useAccount(MyAccount, {
  resolve: { root: true },
  unstable_branch: { name: "feature-branch" },
});

me.$isLoaded && me.$jazz.set("root", { value: "Feature Branch" }); // Will also modify the main account
me.$isLoaded && me.root.$jazz.set("value", "Feature Branch"); // This only modifies the branch

```

### Merging Branches

There are two ways to merge a branch in Jazz, each with different characteristics:

#### 1\. Merge loaded values

This method merges all the values that are currently loaded inside the branch. It happens synchronously and there is no possibility of errors because the values are already loaded.

```ts
async function handleSave() {
  // Merge all currently loaded values in the branch
  branch.$isLoaded && branch.$jazz.unstable_merge();
}

```

This approach is recommended when you can co-locate the merge operation with the branch load, keeping at a glance what the merge operation will affect.

**Info:** 

**Important:** The merge operation will only affect values loaded in the current subscription scope. Values loaded via `ensureLoaded` or `subscribe` will not be affected.

#### 2\. Merge with resolve query

This is a shortcut for loading a value and calling `branch.$jazz.unstable_merge()` on it and will fail if the load isn't possible due to permission errors or network issues.

```ts
async function handleSaveWithResolve() {
  // Merge the branch changes back to main
  await Project.unstable_merge(projectId, {
    resolve: {
      tasks: { $each: true },
    },
    branch: { name: "feature-branch" },
  });
}

```

This approach is recommended for more complex merge operations where it's not possible to co-locate the merge with the branch load.

#### Best Practices

When using version control with Jazz, always be exhaustive when defining the resolve query to keep the depth of the branch under control and ensure that the merge covers all the branched values.

The mechanism that Jazz uses to automatically load accessed values should be avoided with branching, as it might lead to cases where merge won't reach all the branch changes.

All the changes made to the branch will be merged into the main CoValue, preserving both author and timestamp.

The merge is idempotent, so you can merge the same branch multiple times, the result will always depend on the branch changes and loading state.

The merge operation cascades down to the CoValue's children, but not to its parents. So if you call `unstable_merge()` on a task, only the changes to the task and their children will be merged:

```tsx
async function handleTaskSave(index: number) {
  const task = project.tasks[index];
  // Only the changes to the task will be merged
  task.$jazz.unstable_merge();
}

```

## Conflict Resolution

When conflicts occur (the same field is modified in both the branch and main), Jazz uses a "last writer wins" strategy:

```ts
// Branch modifies priority to "high"
branch.$isLoaded && branch.$jazz.applyDiff({ priority: "high" });

// Meanwhile, main modifies priority to "urgent"
originalProject.$isLoaded &&
  originalProject.$jazz.applyDiff({ priority: "urgent" });

// Merge the branch
branch.$isLoaded && branch.$jazz.unstable_merge();

// Main's value ("urgent") wins because it was written later
console.log(originalProject.priority); // "urgent"

```

## Private branches

When the owner is not specified, the branch has the same permissions as the main values.

You can also create a private branch by providing a group owner.

```ts
// Create a private group for the branch
const privateGroup = Group.create();

const privateBranch = Project.load(projectId, {
  unstable_branch: {
    name: "private-edit",
    owner: privateGroup,
  },
});

// Only members of privateGroup can see the branch content
// The sync server cannot read the branch content

```

You can use private branches both to make the changes to the branches "private" until merged, or to give controlled write access to a group of users.

Only users with both write access to the main branch and read access to the private branch have the rights to merge the branch.

**Info:** 

**Important:** Branch names are scoped to their owner. The same branch name with different owners creates completely separate branches. For example, a branch named "feature-branch" owned by User A is completely different from a branch named "feature-branch" owned by User B.

## Branch Identification

You can get the current branch information from the `$jazz` field.

```ts
const myBranch = await Project.load(projectId, {
  unstable_branch: { name: "feature-branch" },
});

console.log(myBranch.$jazz.id); // Branch ID is the same as source
console.log(myBranch.$isLoaded && myBranch.$jazz.branchName); // "feature-branch"
console.log(myBranch.$isLoaded && myBranch.$jazz.isBranched); // true

```


### History
# History

Jazz tracks every change to your data automatically. See who changed what, when they did it, and even look at your data from any point in the past.

See the [version history example](https://github.com/garden-co/jazz/tree/main/examples/version-history) for reference.

Let's use the following schema to see how we can use the edit history.

```ts
export const Task = co.map({
  title: z.string(),
  status: z.literal(["todo", "in-progress", "completed"]),
});
export type Task = co.loaded<typeof Task>;

```

## The $jazz.getEdits() method

Every CoValue has a `$jazz.getEdits()` method that contains the complete history for each field. Here's how to get the edit history for `task.status`:

```ts
task.$jazz.getEdits().status;
// Returns the latest edit

task.$jazz.getEdits().status?.all;
// Returns array of all edits in chronological order

// Check if edits exist
const statusEdits = task.$jazz.getEdits().status;
if (statusEdits && statusEdits.by?.profile.$isLoaded) {
  const name = statusEdits.by.profile.name;
  console.log(`Last changed by ${name}`);
}

```

## Edit Structure

Each edit contains:

```ts
const edit = task.$jazz.getEdits().status;

// The edit object contains:
edit?.value; // The new value: "in-progress"
edit?.by; // Account that made the change
edit?.madeAt; // Date when the change occurred

```

## Accessing History

### Latest Edit

Get the most recent change to a field:

```ts
// Direct access to latest edit
const latest = task.$jazz.getEdits().title;
if (latest) {
  console.log(`Title is now "${latest.value}"`);
}

```

### All Edits

Get the complete history for a field:

```ts
// Get all edits (chronologically)
const allStatusEdits = task.$jazz.getEdits().status?.all || [];

allStatusEdits.forEach((edit, index) => {
  console.log(`Edit ${index}: ${edit.value} at ${edit.madeAt.toISOString()}`);
});
// Edit 0: todo at 2025-05-22T13:00:00.000Z
// Edit 1: in-progress at 2025-05-22T14:00:00.000Z
// Edit 2: completed at 2025-05-22T15:30:00.000Z

```

### Initial Values

The first edit contains the initial value:

```ts
const allEdits = task.$jazz.getEdits().status?.all || [];
const initialValue = allEdits[0]?.value;
console.log(`Started as: ${initialValue}`);
// Started as: todo

```

### Created Date and Last Updated Date

To show created date and last updated date, use the `$jazz.createdAt` and `$jazz.lastUpdatedAt` getters.

```tsx
console.log(new Date(task.$jazz.createdAt));
console.log(new Date(task.$jazz.lastUpdatedAt));

```

## Requirements

* CoValues must be loaded to access history (see [Subscription & Loading](/docs/core-concepts/subscription-and-loading))
* History is only available for fields defined in your schema
* Edit arrays are ordered chronologically (oldest to newest)

## Common Patterns

For practical implementations using history, see [History Patterns](/docs/reference/design-patterns/history-patterns):

* Building audit logs
* Creating activity feeds
* Implementing undo/redo
* Showing change indicators
* Querying historical data


## Server-Side Development

### Quickstart
# Get started with Server Workers in 10 minutes

This quickstart guide will take you from an empty project to a server worker which can interact with your Jazz application.

* You'll get the most out of this guide if you complete [the frontend quickstart guide](/docs/quickstart) first.
* If you've already completed the frontend quickstart, you can skip straight to [extending your schema](#define-your-schema).

**Info:** 

Requires Node.js 20+

## Install Jazz

The `jazz-tools` package includes everything you're going to need to build your first Jazz server worker.

```sh
npm install jazz-tools

```

## Set your API key

Sign up for a free API key at [dashboard.jazz.tools](https://dashboard.jazz.tools) for higher limits or production use, or use your email address as a temporary key to get started quickly.

```bash
NEXT_PUBLIC_JAZZ_API_KEY="you@example.com" # or your API key

```

## Define your schema

We're going to define a simple schema for our server worker. We'll use the `root` on the worker to store a list of bands. We're also going to add a migration to initialise the `root` if it doesn't exist.

```ts
import { co, z } from "jazz-tools";

export const Band = co.map({
  name: z.string(),
});

export const BandList = co.list(Band);

export const JazzFestWorkerAccount = co
  .account({
    root: co.map({
      bandList: BandList,
    }),
    profile: co.profile(),
  })
  .withMigration(async (account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        bandList: [],
      });
      if (account.root.$isLoaded) {
        account.root.$jazz.owner.makePublic();
      }
    }
  });

```

**Info:** 

If you're continuing from the [front-end Quickstart](/docs/quickstart), you can extend your existing schema.

## Create a Server Worker

Jazz provides a CLI to create server workers. You can create a server worker using the following command:

```sh
npx jazz-run account create --name "JazzFest Server Worker"

```

You can copy the output of this command and paste it directly into your `.env` file:

**File name: .env**

```bash
NEXT_PUBLIC_JAZZ_API_KEY=you@example.com # or your API key
#[!code ++:2]
NEXT_PUBLIC_JAZZ_WORKER_ACCOUNT=co_z...
JAZZ_WORKER_SECRET=sealerSecret_z.../signerSecret_z...

```

**Warning:** 

Your `JAZZ_WORKER_SECRET` should **never** be exposed to the client.

## Defining your HTTP request schema

Next, we're going to set up an HTTP request schema to define our request and response. Here, we tell Jazz that we will send a `Band` under the key `band` and expect a `bandList` in response, which is a list of `Band`s.

We also need to tell Jazz which keys should be treated as loaded in the request and response using the `resolve` query.

```ts
import { experimental_defineRequest } from "jazz-tools";
import { Band, BandList } from "./schema";

const workerId = process.env.NEXT_PUBLIC_JAZZ_WORKER_ACCOUNT;

if (!workerId) throw new Error("NEXT_PUBLIC_JAZZ_WORKER_ACCOUNT is not set");

export const announceBand = experimental_defineRequest({
  url: "/api/announce-band",
  workerId: workerId,
  request: { schema: { band: Band }, resolve: { band: true } },
  response: {
    schema: { bandList: BandList },
    resolve: { bandList: { $each: true } },
  },
});

```

## Configure your Server Worker

We're going to use the `startWorker` function to start our server worker, and register a `POST` handler, which will listen for the requests being sent to our server worker.

We'll also use a `resolve` query here to make sure that the `bandList` is loaded on the worker's root.

```ts
import { startWorker } from "jazz-tools/worker";
import { announceBand } from "@/app/announceBandSchema";
import { JazzFestWorkerAccount } from "./schema";

const { worker } = await startWorker({
  syncServer: `wss://cloud.jazz.tools/?key=${process.env.NEXT_PUBLIC_JAZZ_API_KEY}`,
  accountID: process.env.NEXT_PUBLIC_JAZZ_WORKER_ACCOUNT,
  accountSecret: process.env.JAZZ_WORKER_SECRET,
  AccountSchema: JazzFestWorkerAccount,
});

export async function POST(request: Request) {
  return announceBand.handle(request, worker, async ({ band }) => {
    if (!band) {
      throw new Error("Band is required");
    }
    const {
      root: { bandList },
    } = await worker.$jazz.ensureLoaded({
      resolve: {
        root: {
          bandList: true,
        },
      },
    });
    bandList.$jazz.push(band);
    return { bandList };
  });
}

```

## Start your server worker

We can now start our development server to make sure everything is working.

```bash
npm run dev

```

### Not working?

* Check you're importing `startWorker` from `jazz-tools/worker`

**Info: Still stuck?** Ask for help on [Discord](https://discord.gg/utDMjHYg42)!

## Send requests to your server worker

### Creating a Jazz Client

_If you already have a working provider from the frontend quickstart, you can skip this step._

```tsx
import { JazzReactProvider } from "jazz-tools/react";

const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY;

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
  <html lang="en">
    <body>
      <JazzReactProvider
        sync={{ peer: `wss://cloud.jazz.tools/?key=${apiKey}` }}
      >
        {children}
      </JazzReactProvider>
    </body>
  </html>
);
}

```

### Creating your page component

We're going to send a request to our server worker to announce a new band. Our worker will respond with a list of bands that we can display on our page.

```tsx
"use client";
import type { co } from "jazz-tools";
import { useState } from "react";
import { announceBand } from "@/app/announceBandSchema";
import type { BandList } from "./schema";

export default function Home() {
  const [bandName, setBandName] = useState("");
  const [bandList, setBandList] =
    useState<co.loaded<typeof BandList, { $each: true }>>();
  const handleAnnounceBand = async () => {
    const bandListResponse = await announceBand.send({
      band: { name: bandName },
    });
    setBandName("");
    if (bandListResponse.bandList.$isLoaded) {
      setBandList(bandListResponse.bandList);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={bandName}
        onChange={(e) => setBandName(e.target.value)}
      />
      <button type="button" onClick={handleAnnounceBand}>
        Announce Band
      </button>
      <div>
        {bandList?.$isLoaded &&
          bandList.map(
            (band) => band && <div key={band?.$jazz.id}>{band.name}</div>,
          )}
      </div>
    </div>
  );
}

```

## Try it out!

Your browser should now be showing you a page with an input field and a button. If you enter a band name and click the button, your server worker will receive the request and add the band to the list.

**Congratulations! 🎉** You've just built your first Jazz server worker!

This simple pattern is the foundation for building powerful, real-time applications.

Here are some ideas about what you could use your server worker for:

* integrating with payment providers
* sending emails/SMSes
* gathering data from external APIs
* managing authoritative state

Looking forward to seeing what you build!

## Next steps

* Complete the [front-end quickstart](/docs/quickstart) to learn more about how to build real-time UIs using Jazz
* Find out how to [handle errors](/docs/server-side/communicating-with-workers/http-requests#error-handling) gracefully in your server worker
* Learn how to share and [collaborate on data](/docs/permissions-and-sharing/overview) in groups with complex permissions


### Setup
# Running Jazz on the server

Jazz is a distributed database that can be used on both clients or servers without any distinction.

You can use servers to:

* perform operations that can't be done on the client (e.g. sending emails, making HTTP requests, etc.)
* validate actions that require a central authority (e.g. a payment gateway, booking a hotel, etc.)

We call the code that runs on the server a "Server Worker".

The main difference to keep in mind when working with Jazz compared to traditional systems is that server code doesn't have any special or privileged access to the user data. You need to be explicit about what you want to share with the server.

This means that your server workers will have their own accounts, and they need to be explicitly given access to the CoValues they need to work on.

## Generating credentials

Server Workers typically have static credentials, consisting of a public Account ID and a private Account Secret.

To generate new credentials for a Server Worker, you can run:

```sh
npx jazz-run account create --name "My Server Worker"

```

The name will be put in the public profile of the Server Worker's `Account`, which can be helpful when inspecting metadata of CoValue edits that the Server Worker has done.

**Info: Note** 

By default the account will be stored in Jazz Cloud. You can use the `--peer` flag to store the account on a different sync server.

## Running a server worker

You can use `startWorker` to run a Server Worker. Similarly to setting up a client-side Jazz context, it:

* takes a custom `AccountSchema` if you have one (for example, because the worker needs to store information in its private account root)
* takes a URL for a sync & storage server

The migration defined in the `AccountSchema` will be executed every time the worker starts, the same way as it would be for a client-side Jazz context.

```ts
import { startWorker } from "jazz-tools/worker";

const { worker } = await startWorker({
  AccountSchema: MyWorkerAccount,
  syncServer: `wss://cloud.jazz.tools/?key=${apiKey}`,
  accountID: process.env.JAZZ_WORKER_ACCOUNT,
  accountSecret: process.env.JAZZ_WORKER_SECRET,
});

```

`worker` is an instance of the `Account` schema provided, and acts like `me` (as returned by `useAccount` on the client).

It will implicitly become the current account, and you can avoid mentioning it in most cases.

For this reason we also recommend running a single worker instance per server, because it makes your code much more predictable.

In case you want to avoid setting the current account, you can pass `asActiveAccount: false` to `startWorker`.

## Storing & providing credentials

Server Worker credentials are typically stored and provided as environment variables.

**Take extra care with the Account Secret — handle it like any other secret environment variable such as a DB password.**

## Wasm on Edge runtimes

To maximize compatibility, Jazz falls back to a slower, JavaScript crypto implementation if the faster WASM implementation is not available.

On some edge platforms, such as Cloudflare Workers or Vercel Edge Functions, environment security restrictions may trigger this fallback unnecessarily.

You can ensure that Jazz uses the faster WASM implementation by importing the WASM loader before using Jazz. For example:

```ts
import "jazz-tools/load-edge-wasm";
// Other Jazz Imports

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Jazz application logic
    return new Response("Hello from Jazz on Cloudflare!");
  },
};

```

Currently, the Jazz Loader is tested on the following edge environments:

* Cloudflare Workers
* Vercel Functions

### Requirements

* Edge runtime environment that supports WebAssembly
* `jazz-tools/load-edge-wasm` must be imported before any Jazz import

## Node-API

Jazz uses a WASM-based crypto implementation that provides near-native performance while ensuring full compatibility across a wide variety of environments.

For even higher performance on Node.js or Deno, you can enable the native crypto (Node-API) implementation. Node-API is Node.js's native API for building modules in Native Code (Rust/C++) that interact directly with the underlying system, allowing for true native execution speed.

You can use it as follows:

```ts
import { startWorker } from "jazz-tools/worker";
import { NapiCrypto } from "jazz-tools/napi";

const { worker } = await startWorker({
  syncServer: `wss://cloud.jazz.tools/?key=${apiKey}`,
  accountID: process.env.JAZZ_WORKER_ACCOUNT,
  accountSecret: process.env.JAZZ_WORKER_SECRET,
  crypto: await NapiCrypto.create(),
});

```

**Info: Note** 

The Node-API implementation is not available on all platforms. It is only available on Node.js 20.x and higher. The supported platforms are:

* macOS (x64, ARM64)
* Linux (x64, ARM64, ARM, musl)

It does not work in edge runtimes.

### On Next.js

In order to use Node-API with Next.js, you need to tell Next.js to bundle the native modules in your build.

You can do this by adding the required packages to the [serverExternalPackages](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages) array in your `next.config.js`.

**Note**: if you're deploying to Vercel, be sure to use the `nodejs` runtime!

**File name: next.config.js**

```ts
module.exports = {
  serverExternalPackages: [
    "cojson-core-napi",
    "cojson-core-napi-linux-x64-gnu",
    "cojson-core-napi-linux-x64-musl",
    "cojson-core-napi-linux-arm64-gnu",
    "cojson-core-napi-linux-arm64-musl",
    "cojson-core-napi-darwin-x64",
    "cojson-core-napi-darwin-arm64",
    "cojson-core-napi-linux-arm-gnueabihf",
  ],
};

```


### Overview
# Communicating with Server Workers

Server Workers in Jazz can receive data from clients through two different APIs, each with their own characteristics and use cases. This guide covers the key properties of each approach to help you choose the right one for your application.

## Overview

Jazz provides three ways to communicate with Server Workers:

1. **JazzRPC** \- A simple, yet powerful RPC system that allows you to call functions on Server Workers from the client side.
2. **HTTP Requests** \- The easiest to work with and deploy, ideal for simple communication with workers.
3. **Inbox** \- Fully built using the Jazz data model with offline support

## JazzRPC (Recommended)

JazzRPC is the most straightforward way to communicate with Server Workers. It works well with any framework or runtime that supports standard Request and Response objects, can be scaled horizontally, and put clients and workers in direct communication.

### When to use JazzRPC

Use JazzRPC when you need immediate responses, are deploying to serverless environments, need horizontal scaling, or are working with standard web frameworks.

It's also a good solution when using full-stack frameworks like Next.js, where you can use the API routes to handle the server-side logic.

[Learn more about JazzRPC →](/docs/server-side/jazz-rpc)

## HTTP Requests

If all you need is basic authentication when communicating with a worker, you can use Regular HTTP requests. They are the easiest to work with and deploy, ideal for simple communication with workers.

HTTP requests are the easiest way to communicate with Server Workers. They don't come with any of the benefits of JazzRPC, but are a good solution for simple communication with workers.

### When to use HTTP Requests

Use HTTP requests when you don't need the advanced features of JazzRPC, but you need to communicate with a worker from a serverless environment or a standard web framework and need basic authentication.

[Learn more about HTTP Requests →](/docs/server-side/communicating-with-workers/http-requests)

## Inbox

The Inbox API is fully built using the Jazz data model and provides offline support. Requests and responses are synced as soon as the device becomes online, but require the Worker to always be online to work properly.

### When to use Inbox

Use Inbox when you need offline support, want to leverage the Jazz data model, can ensure the worker stays online, need persistent message storage, or want to review message history.

It works great when you don't want to expose your server with a public address, because it uses Jazz's sync to make the communication happen.

Since Jazz handles all the network communication, the entire class of network errors that usually come with traditional HTTP requests are not a problem when using the Inbox API.

[Learn more about Inbox →](/docs/server-side/communicating-with-workers/inbox)


### JazzRPC
# JazzRPC

JazzRPC is the most straightforward and complete way to securely communicate with Server Workers. It works well with any framework or runtime that supports standard Request and Response objects, can be scaled horizontally, and puts clients and workers in direct communication.

## Setting up JazzRPC

### Defining request schemas

Use `experimental_defineRequest` to define your API schema:

```ts
import { experimental_defineRequest, z } from "jazz-tools";
import { Event, Ticket } from "@/lib/schema";

const workerId = process.env.NEXT_PUBLIC_JAZZ_WORKER_ACCOUNT!;

export const bookEventTicket = experimental_defineRequest({
  url: "/api/book-event-ticket",
  // The id of the worker Account or Group
  workerId,
  // The schema definition of the data we send to the server
  request: {
    schema: {
      event: Event,
    },
    // The data that will be considered as "loaded" in the server input
    resolve: {
      event: { reservations: true },
    },
  },
  // The schema definition of the data we expect to receive from the server
  response: {
    schema: { ticket: Ticket },
    // The data that will be considered as "loaded" in the client response
    // It defines the content that the server directly sends to the client, without involving the sync server
    resolve: { ticket: true },
  },
});

```

### Setting up the Server Worker

We need to start a Server Worker instance that will be able to sync data with the sync server, and handle the requests.

```ts
import { startWorker } from "jazz-tools/worker";

export const jazzServer = await startWorker({
  syncServer: "wss://cloud.jazz.tools/?key=your-api-key",
  accountID: process.env.JAZZ_WORKER_ACCOUNT,
  accountSecret: process.env.JAZZ_WORKER_SECRET,
});

```

## Handling JazzRPC requests on the server

### Creating API routes

Create API routes to handle the defined RPC requests. Here's an example using Next.js API routes:

```ts
import { jazzServer } from "@/jazzServer";
import { Ticket } from "@/lib/schema";
import { bookEventTicket } from "@/bookEventTicket";
import { Group, JazzRequestError } from "jazz-tools";

export async function POST(request: Request) {
  return bookEventTicket.handle(
    request,
    jazzServer.worker,
    async ({ event }, madeBy) => {
      const ticketGroup = Group.create(jazzServer.worker);
      const ticket = Ticket.create({
        account: madeBy,
        event,
      });

      // Give access to the ticket to the client
      ticketGroup.addMember(madeBy, "reader");

      event.reservations.$jazz.push(ticket);

      return {
        ticket,
      };
    },
  );
}

```

## Making requests from the client

### Using the defined API

Make requests from the client using the defined API:

```ts
import { bookEventTicket } from "@/bookEventTicket";
import { Event } from "@/lib/schema";
import { co, isJazzRequestError } from "jazz-tools";

export async function sendEventBookingRequest(event: co.loaded<typeof Event>) {
  const { ticket } = await bookEventTicket.send({ event });

  return ticket;
}

export async function sendEventBookingRequest(event: co.loaded<typeof Event>) {
  try {
    const { ticket } = await bookEventTicket.send({ event });

    return ticket;
  } catch (error) {
    // This works as a type guard, so you can easily get the error message and details
    if (isJazzRequestError(error)) {
      alert(error.message);
      return;
    }
  }
}

```

## Error handling

### Server-side error handling

Use `JazzRequestError` to return proper HTTP error responses:

```ts
export async function POST(request: Request) {
  return bookEventTicket.handle(
    request,
    jazzServer.worker,
    async ({ event }, madeBy) => {
      // Check if the event is full
      if (event.reservations.length >= event.capacity) {
        // The JazzRequestError is propagated to the client, use it for any validation errors
        throw new JazzRequestError("Event is full", 400);
      }

      const ticketGroup = Group.create(jazzServer.worker);
      const ticket = Ticket.create({
        account: madeBy,
        event,
      });

      // Give access to the ticket to the client
      ticketGroup.addMember(madeBy, "reader");

      event.reservations.$jazz.push(ticket);

      return {
        ticket,
      };
    },
  );
}

```

**Info: Note** 

To ensure that the limit is correctly enforced, the handler should be deployed in a single worker instance (e.g. a single Cloudflare DurableObject).

Details on how to deploy a single instance Worker are available in the [Deployments & Transactionality](#deployments--transactionality) section.

### Client-side error handling

Handle errors on the client side:

```ts
export async function sendEventBookingRequest(event: co.loaded<typeof Event>) {
  try {
    const { ticket } = await bookEventTicket.send({ event });

    return ticket;
  } catch (error) {
    // This works as a type guard, so you can easily get the error message and details
    if (isJazzRequestError(error)) {
      alert(error.message);
      return;
    }
  }
}

```

**Info: Note** 

The `experimental_defineRequest` API is still experimental and may change in future versions. For production applications, consider the stability implications.

## Security safeguards provided by JazzRPC

JazzRPC includes several built-in security measures to protect against common attacks:

### Cryptographic Authentication

* **Digital Signatures**: Each RPC is cryptographically signed using the sender's private key
* **Signature Verification**: The server verifies the signature using the sender's public key to ensure message authenticity and to identify the sender account
* **Tamper Protection**: Any modification to the request payload will invalidate the signature

### Replay Attack Prevention

* **Unique Message IDs**: Each RPC has a unique identifier (`co_z${string}`)
* **Duplicate Detection**: incoming messages ids are tracked to prevent replay attacks
* **Message Expiration**: RPCs expire after 60 seconds to provide additional protection

These safeguards ensure that JazzRPC requests are secure, authenticated, and protected against common attack vectors while maintaining the simplicity of standard HTTP communication.

## Deployments & Transactionality

### Single Instance Requirements

Some operations need to happen one at a time and in the same place, otherwise the data can get out of sync.

For example, if you are checking capacity for an event and creating tickets, you must ensure only one server is doing it. If multiple servers check at the same time, they might all think there is space and allow too many tickets.

Jazz uses eventual consistency (data takes a moment to sync between regions), so this problem is worse if you run multiple server copies in different locations.

Until Jazz supports transactions across regions, the solution is to deploy a single server instance for these sensitive operations.

Examples of when you must deploy on a single instance are:

1. Distribute a limited number of tickets  
   * Limiting ticket sales so that only 100 tickets are sold for an event.  
   * The check (“is there space left?”) and ticket creation must happen together, or you risk overselling.
2. Inventory stock deduction  
   * Managing a product stock count (e.g., 5 items left in store).  
   * Multiple instances could let multiple buyers purchase the last item at the same time.
3. Sequential ID or token generation  
   * Generating unique incremental order numbers (e.g., #1001, #1002).  
   * Multiple instances could produce duplicates if not coordinated.

Single servers are necessary to enforce invariants or provide a consistent view of the data.

As a rule of thumb, when the output of the request depends on the state of the database, you should probably deploy on a single instance.

### Multi-Region Deployment

If your code doesn’t need strict rules to keep data in sync (no counters, no limits, no “check‑then‑update” logic), you can run your workers in many regions at the same time.

This way:

* Users connect to the closest server (faster).
* If one region goes down, others keep running (more reliable).

Examples of when it's acceptable to deploy across multiple regions are:

1. Sending confirmation emails  
   * After an action is complete, sending an email to the user does not depend on current database state.
2. Pushing notifications  
   * Broadcasting “event booked” notifications to multiple users can be done from any region.
3. Logging or analytics events  
   * Recording “user clicked this button” or “page viewed” events, since these are additive and don’t require strict ordering.
4. Calling external APIs (e.g., LLMs, payment confirmations)  
   * If the response does not modify shared counters or limits, it can be done from any region.
5. Pre-computing cached data or summaries  
   * Generating read-only previews or cached summaries where stale data is acceptable and does not affect core logic.

Generally speaking, if the output of the request does not depend on the state of the database, you can deploy across multiple regions.


### HTTP requests
# HTTP Requests with Server Workers

HTTP requests are the simplest way to communicate with Server Workers. While they don't provide all the features of [JazzRPC](/docs/server-side/jazz-rpc), they are a good solution when all you need is basic authentication.

They work by generating a short-lived token with `generateAuthToken` and attaching it to the request headers as `Authorization: Jazz <token>`. The server can then verify the token with `authenticateRequest` and get the account that the request was made by.

**Info: Note** 

While the token is cryptographically secure, using non secure connections still makes you vulnerable to MITM attacks as - unlike JazzRPC - the request is not signed.

Replay attacks are mitigated by token expiration (default to 1 minute), but it's up to you to ensure that the token is not reused.

It is recommended to use HTTPS whenever possible.

## Creating a Request

You can use any method to create a request; the most common is the `fetch` API.

By default, the token is expected to be in the `Authorization` header in the form of `Jazz <token>`.

```ts
import { generateAuthToken } from "jazz-tools";

const response = await fetch("https://example.com", {
  headers: {
    Authorization: `Jazz ${generateAuthToken()}`,
  },
});

```

## Authenticating requests

You can use the `authenticateRequest` function to authenticate requests.

Attempting to authenticate a request without a token doesn't fail; it returns `account` as `undefined`. For endpoints that **require** authentication, ensure `account` is defined in addition to any permission checks you may need.

```ts
import { authenticateRequest } from "jazz-tools";
import { startWorker } from "jazz-tools/worker";

export async function GET(request: Request) {
  const worker = await startWorker({
    syncServer: "wss://cloud.jazz.tools/?key=your-api-key",
    accountID: process.env.JAZZ_WORKER_ACCOUNT,
    accountSecret: process.env.JAZZ_WORKER_SECRET,
    asActiveAccount: true,
  });

  const { account, error } = await authenticateRequest(request);

  // There was an error validating the token (e.g., invalid or expired)
  if (error) {
    return new Response(JSON.stringify(error), { status: 401 });
  }

  if (!account) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(
    JSON.stringify({
      message: `The request was made by ${account.$jazz.id}`,
    }),
  );
}

```

## Multi-account environments

If you are using multiple accounts in your environment - for instance if your server starts multiple workers - or in general if you need to send and authenticate requests as a specific account, you can specify which one to use when generating the token or when authenticating the request.

### Making a request as a specific account

`generateAuthToken` accepts an optional account parameter, so you can generate a token for a specific account.

```ts
const response = await fetch("https://example.com", {
  headers: {
    Authorization: `Jazz ${generateAuthToken(account)}`,
  },
});

```

### Authenticating a request as a specific account

Similarly, specify the account used to verify the token via the `loadAs` option:

```ts
import { authenticateRequest } from "jazz-tools";
import { startWorker } from "jazz-tools/worker";

export async function GET(request: Request) {
  const { worker } = await startWorker({
    syncServer: "wss://cloud.jazz.tools/?key=your-api-key",
    accountID: process.env.JAZZ_WORKER_ACCOUNT,
    accountSecret: process.env.JAZZ_WORKER_SECRET,
  });

  const { account, error } = await authenticateRequest(request, {
    loadAs: worker,
  });
}

```

## Custom token expiration

You can specify the expiration time of the token using the `expiration` option. The default expiration time is 1 minute.

```ts
import { authenticateRequest } from "jazz-tools";

export async function GET(request: Request) {
  const { account, error } = await authenticateRequest(request, {
    expiration: 1000 * 60 * 60 * 24, // 24 hours
  });
}

```

## Custom token location

While using the `Authorization` header using the `Jazz <token>` format is the most common way to send the token, you can provide the token in any other way you want.

For example, you can send the token in the `x-jazz-auth-token` header:

```ts
import { generateAuthToken } from "jazz-tools";

const response = await fetch("https://example.com", {
  headers: {
    "x-jazz-auth-token": generateAuthToken(),
  },
});

```

Then you can specify the location of the token using the `getToken` option:

```ts
import { authenticateRequest } from "jazz-tools";

export async function GET(request: Request) {
  const { account, error } = await authenticateRequest(request, {
    getToken: (request) => request.headers.get("x-jazz-auth-token"),
  });
}

```

## Manual token parsing

If you need to manually parse a token from a string, you can use the `parseAuthToken` function.

```ts
import { parseAuthToken, generateAuthToken } from "jazz-tools";

const myToken = generateAuthToken();

const { account, error } = await parseAuthToken(myToken);

```


### Inbox API
# Inbox API with Server Workers

The Inbox API provides a message-based communication system for Server Workers in Jazz.

It works on top of the Jazz APIs and uses sync to transfer messages between the client and the server.

## Setting up the Inbox API

### Define the inbox message schema

Define the inbox message schema in your schema file:

```ts
export const BookTicketMessage = co.map({
  type: z.literal("bookTicket"),
  event: Event,
});

```

Any kind of CoMap is valid as an inbox message.

### Setting up the Server Worker

Run a server worker and subscribe to the `inbox`:

```ts
import { Account, co, Group } from "jazz-tools";
import { startWorker } from "jazz-tools/worker";
import { BookTicketMessage, Ticket } from "@/lib/schema";

const {
  worker,
  experimental: { inbox },
} = await startWorker({
  accountID: process.env.JAZZ_WORKER_ACCOUNT,
  accountSecret: process.env.JAZZ_WORKER_SECRET,
  syncServer: "wss://cloud.jazz.tools/?key=your-api-key",
});

inbox.subscribe(BookTicketMessage, async (message, senderID) => {
  const madeBy = await co.account().load(senderID, { loadAs: worker });

  const { event } = await message.$jazz.ensureLoaded({
    resolve: {
      event: {
        reservations: true,
      },
    },
  });

  const ticketGroup = Group.create(worker);
  const ticket = Ticket.create({
    account: madeBy,
    event,
  });

  if (madeBy.$isLoaded) {
    // Give access to the ticket to the client
    ticketGroup.addMember(madeBy, "reader");
    event.reservations.$jazz.push(ticket);
  }

  return ticket;
});

```

### Handling multiple message types

`inbox.subscribe` should be called once per worker instance.

If you need to handle multiple message types, you can use the `co.discriminatedUnion` function to create a union of the message types.

```ts
const CancelReservationMessage = co.map({
  type: z.literal("cancelReservation"),
  event: Event,
  ticket: Ticket,
});

export const InboxMessage = co.discriminatedUnion("type", [
  BookTicketMessage,
  CancelReservationMessage,
]);

```

And check the message type in the handler:

```ts
import { InboxMessage } from "@/lib/schema";

inbox.subscribe(InboxMessage, async (message, senderID) => {
  switch (message.type) {
    case "bookTicket":
      return await handleBookTicket(message, senderID);
    case "cancelReservation":
      return await handleCancelReservation(message, senderID);
  }
});

```

## Sending messages from the client

### Using the Inbox Sender hook

Use `experimental_useInboxSender` to send messages from React components:

```ts
import { co } from "jazz-tools";
import { experimental_useInboxSender } from "jazz-tools/react";
import { BookTicketMessage, Event } from "@/lib/schema";

function EventComponent({ event }: { event: co.loaded<typeof Event> }) {
  const sendInboxMessage = experimental_useInboxSender(process.env.WORKER_ID);
  const [isLoading, setIsLoading] = useState(false);

  const onBookTicketClick = async () => {
    setIsLoading(true);

    const ticketId = await sendInboxMessage(
      BookTicketMessage.create({
        type: "bookTicket",
        event: event,
      }),
    );

    alert(`Ticket booked: ${ticketId}`);
    setIsLoading(false);
  };

  return (
    <button onClick={onBookTicketClick} disabled={isLoading}>
      Book Ticket
    </button>
  );
}

```

The `sendInboxMessage` API returns a Promise that waits for the message to be handled by a Worker. A message is considered to be handled when the Promise returned by `inbox.subscribe` resolves. The value returned will be the id of the CoValue returned in the `inbox.subscribe` resolved promise.

## Deployment considerations

Multi-region deployments are not supported when using the Inbox API.

If you need to split the workload across multiple regions, you can use the [HTTP API](/docs/server-side/communicating-with-workers/http-requests) instead.


### Server-side rendering
# Add Server-Side Rendering to your App

This guide will take your simple client-side app to the next level by showing you how to create a server-rendered page to publish your data to the world.

**Info:** 

If you haven't gone through the [front-end Quickstart](/docs/quickstart), you might find this guide a bit confusing. If you're looking for a quick reference, you might find [this page](/docs/project-setup#ssr-integration) more helpful!

## Creating an agent

For Jazz to access data on the server, we need to create an SSR agent, which is effectively a read-only user which can access public data stored in Jazz.

We can create this user using the `createSSRJazzAgent` function. In this example, we'll create a new file and export the agent, which allows us to import and use the same agent in multiple pages.

```ts
import { createSSRJazzAgent } from "jazz-tools/ssr";

export const jazzSSR = createSSRJazzAgent({
  peer: "wss://cloud.jazz.tools/",
});

```

## Telling Jazz to use the SSR agent

Normally, Jazz expects a logged in user (or an anonymous user) to be accessing data. We can use the `enableSSR` setting to tell Jazz that this may not be the case, and the data on the page may be being accessed by an agent.

```tsx
"use client";
import { JazzReactProvider } from "jazz-tools/react";
import { JazzFestAccount } from "./schema";

const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY;

export function JazzWrapper({ children }: { children: React.ReactNode }) {
  return (
    <JazzReactProvider
      sync={{ peer: `wss://cloud.jazz.tools/?key=${apiKey}` }}
      AccountSchema={JazzFestAccount}
      enableSSR // [!code ++]
    >
      {children}
    </JazzReactProvider>
  );
}

```

## Making your data public

By default, when you create data in Jazz, it's private and only accessible to the account that created it.

However, the SSR agent is credential-less and unauthenticated, so it can only read data which has been made public. Although Jazz allows you to define [complex, role-based permissions](/docs/permissions-and-sharing/overview), here, we'll focus on making the CoValues public.

**File name: app/schema.ts**

```ts
import { co, z } from "jazz-tools";

export const Band = co
  .map({
    name: z.string(), // Zod primitive type
  })
  // [!code ++:3]
  .withMigration((band) => {
    band.$jazz.owner.makePublic();
  });

export const Festival = co.list(Band);

export const JazzFestAccountRoot = co.map({
  myFestival: Festival,
});

export const JazzFestAccount = co
  .account({
    root: JazzFestAccountRoot,
    profile: co.profile(),
  })
  .withMigration(async (account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        myFestival: [],
      });

      // [!code ++:8]
      if (account.root.$isLoaded) {
        const { myFestival } = await account.root.$jazz.ensureLoaded({
          resolve: {
            myFestival: true,
          },
        });
        myFestival.$jazz.owner.makePublic();
      }
    }
  });

```

## Creating a server-rendered page

Now let's set up a page which will be read by the agent we created earlier, and rendered fully on the server.

```tsx
import { jazzSSR } from "@/app/jazzSSR";
import { Festival } from "@/app/schema";

export default async function ServerSidePage(props: {
  params: { festivalId: string };
}) {
  const { festivalId } = await props.params;
  const festival = await Festival.load(festivalId, {
    loadAs: jazzSSR,
    resolve: {
      $each: {
        $onError: "catch",
      },
    },
  });

  return (
    <main>
      <h1>🎪 Server-rendered Festival {festivalId}</h1>

      <ul>
        {festival.$isLoaded &&
          festival.map((band) => {
            if (!band.$isLoaded) return null;
            return <li key={band.$jazz.id}>🎶 {band.name}</li>;
          })}
      </ul>
    </main>
  );
}

```

## Linking to your server-rendered page

The last step is to link to your server-rendered page from your `Festival` component so that you can find it easily!

```tsx
"use client";
import { useAccount } from "jazz-tools/react";
// [!code ++:1]
import Link from "next/link";
import { JazzFestAccount } from "@/app/schema";

export function Festival() {
  const me = useAccount(JazzFestAccount, {
    resolve: { root: { myFestival: { $each: { $onError: "catch" } } } },
  });
  if (!me.$isLoaded) return null;
  return (
    <>
      <ul>
        {me.root.myFestival.map((band) => {
          if (!band.$isLoaded) return null;
          return <li key={band.$jazz.id}>{band.name}</li>;
        })}
      </ul>
      {/* [!code ++:3] */}
      <Link href={`/festival/${me.root.myFestival.$jazz.id}`}>
        Go to my Server-Rendered Festival Page!
      </Link>
    </>
  );
}

```

## Start your app

Let's fire up your app and see if it works!

```bash
npm run dev

```

If everything's going according to plan, your app will load with the home page. You can click the link to your server-rendered page to see your data - fully rendered on the server!

**Congratulations! 🎉** You've now set up server-side rendering in your React app. You can use this same pattern to render any page on the server.

### Not working?

* Did you add `enableSSR` to the provider?
* Did you add `loadAs: jazzSSR` to `Festival.load`?
* Did you add the migrations to make the data public?

**Info: Still stuck?** Ask for help on [Discord](https://discord.gg/utDMjHYg42)!

## Next steps

* Learn more about how to [manage complex permissions](/docs/permissions-and-sharing/overview) using groups and roles
* Dive deeper into the collaborative data structures we call [CoValues](/docs/core-concepts/covalues/overview)
* Learn more about migrations in the [accounts and migrations docs](/docs/core-concepts/schemas/accounts-and-migrations)


## Project setup

### Providers
If you're using vanilla JS, you won't be able to use an off the shelf provider.

More docs for vanilla are coming!


## Tooling & Resources

### create-jazz-app
# create-jazz-app

Jazz comes with a CLI tool that helps you quickly scaffold new Jazz applications. There are two main ways to get started:

1. **Starter templates** \- Pre-configured setups to start you off with your preferred framework
2. **Example apps** \- Extend one of our [example applications](https://jazz.tools/examples) to build your project

## Quick Start with Starter Templates

Create a new Jazz app from a starter template in seconds:

```bash
npx create-jazz-app@latest --api-key YOUR_API_KEY

```

**Info: Tip** 

Sign up for a free API key at [dashboard.jazz.tools](https://dashboard.jazz.tools) for higher limits or production use, or use your email address as a temporary key to get started quickly.

```bash
NEXT_PUBLIC_JAZZ_API_KEY="you@example.com" # or your API key

```

This launches an interactive CLI that guides you through selecting:

* Pre-configured frameworks and authentication methods (See [Available Starters](#available-starters))
* Package manager
* Project name
* Jazz Cloud API key (optional) - Provides seamless sync and storage for your app

## Command Line Options

If you know what you want, you can specify options directly from the command line:

```bash
# Basic usage with project name
npx create-jazz-app@latest my-app --framework react --api-key YOUR_API_KEY

# Specify a starter template
npx create-jazz-app@latest my-app --starter react-passkey-auth --api-key YOUR_API_KEY

# Specify example app
npx create-jazz-app@latest my-app --example chat --api-key YOUR_API_KEY

```

### Available Options

* `directory` \- Directory to create the project in (defaults to project name)
* `-f, --framework` \- Framework to use (React, React Native, Svelte)
* `-s, --starter` \- Starter template to use
* `-e, --example` \- Example project to use
* `-p, --package-manager` \- Package manager to use (npm, yarn, pnpm, bun, deno)
* `-k, --api-key` \- Jazz Cloud API key (during our [free public alpha](/docs/core-concepts/sync-and-storage#free-public-alpha), you can use your email as the API key)
* `-h, --help` \- Display help information

## Start From an Example App

Want to start from one of [our example apps](https://jazz.tools/examples)? Our example apps include specific examples of features and use cases. They demonstrate real-world patterns for building with Jazz. Use one as your starting point:

```bash
npx create-jazz-app@latest --example chat

```

## Available Starters

Starter templates are minimal setups that include the basic configuration needed to get started with Jazz. They're perfect when you want a clean slate to build on.

Choose from these ready-to-use starter templates:

* `react-passkey-auth` \- React with Passkey authentication (easiest to start with)
* `react-clerk-auth` \- React with Clerk authentication
* `svelte-passkey-auth` \- Svelte with Passkey authentication
* `rn-clerk-auth` \- React Native with Clerk authentication

Run `npx create-jazz-app --help` to see the latest list of available starters.

## What Happens Behind the Scenes

When you run `create-jazz-app`, we'll:

1. Ask for your preferences (or use your command line arguments)
2. Clone the appropriate starter template
3. Update dependencies to their latest versions
4. Install all required packages
5. Set up your project and show next steps

## Requirements

* Node.js 20.0.0 or later
* Your preferred package manager (npm, yarn, pnpm, bun, or deno)


### Inspector
# Jazz Inspector

[Jazz Inspector](https://inspector.jazz.tools) is a tool to visually inspect a Jazz account or other CoValues.

To pass your account credentials, go to your Jazz app, copy the full JSON from the `jazz-logged-in-secret` local storage key, and paste it into the Inspector's Account ID field.

Alternatively, you can pass the Account ID and Account Secret separately.

<https://inspector.jazz.tools>

## Exporting current account to Inspector from your app

In development mode, you can launch the Inspector from your Jazz app to inspect your account by pressing `Cmd+J`.

## Embedding the Inspector widget into your app \[!framework=react,svelte,vue,vanilla\]

You can also embed the Inspector directly into your app, so you don't need to open a separate window.

Install the custom element and render it.

```ts
import "jazz-tools/inspector/register-custom-element";

document.body.appendChild(document.createElement("jazz-inspector"));

```

Or

```svelte
<script lang="ts">
  import "jazz-tools/inspector/register-custom-element"
</script>

<jazz-inspector></jazz-inspector>

```

This will show the Inspector launch button on the right of your page.


### AI tools (llms.txt)
# Using AI to build Jazz apps

AI tools, particularly large language models (LLMs), can accelerate your development with Jazz. Searching docs, responding to questions and even helping you write code are all things that LLMs are starting to get good at.

However, Jazz is a rapidly evolving framework, so sometimes AI might get things a little wrong.

To help the LLMs, we provide the Jazz documentation in a txt file that is optimized for use with AI tools, like Cursor.

[llms-full.txt](/vanilla/llms-full.txt) 

## Setting up AI tools

Every tool is different, but generally, you'll need to either paste the contents of the [llms-full.txt](https://jazz.tools/llms-full.txt) file directly in your prompt, or attach the file to the tool.

### ChatGPT and v0

Upload the txt file in your prompt.

![ChatGPT prompt with llms-full.txt attached](/chatgpt-with-llms-full-txt.jpg)

### Cursor

1. Go to Settings > Cursor Settings > Features > Docs
2. Click "Add new doc"
3. Enter the following URL:

```
https://jazz.tools/llms-full.txt

```

## llms.txt convention

We follow the llms.txt [proposed standard](https://llmstxt.org/) for providing documentation to AI tools at inference time that helps them understand the context of the code you're writing.

## Limitations and considerations

AI is amazing, but it's not perfect. What works well this week could break next week (or be twice as good).

We're keen to keep up with changes in tooling to help support you building the best apps, but if you need help from humans (or you have issues getting set up), please let us know on [Discord](https://discord.gg/utDMjHYg42).


### FAQs
# Frequently Asked Questions

## How established is Jazz?

Jazz is backed by fantastic angel and institutional investors with experience and know-how in devtools and has been in development since 2020.

## Will Jazz be around long-term?

We're committed to Jazz being around for a long time! We understand that when you choose Jazz for your projects, you're investing time and making a significant architectural choice, and we take that responsibility seriously. That's why we've designed Jazz with longevity in mind from the start:

* The open source nature of our sync server means you'll always be able to run your own infrastructure
* Your data remains accessible even if our cloud services change
* We're designing the protocol as an open specification

This approach creates a foundation that can continue regardless of any single company's involvement. The local-first architecture means your apps will always work, even offline, and your data remains yours.

## How secure is my data?

Jazz encrypts all your data by default using modern cryptographic standards. Every transaction is cryptographically signed, and data is encrypted using industry-standard algorithms including BLAKE3 hashing, Ed25519 signatures, and XSalsa20 stream ciphers.

Key features of Jazz's security:

* **Privacy by default**: Your data is encrypted even on Jazz Cloud servers
* **Automatic key rotation**: When members are removed from Groups, encryption keys rotate automatically
* **Verifiable authenticity**: Every change is cryptographically signed
* **Zero-trust architecture**: Only people you explicitly grant access can read your data

For technical details, see our [encryption documentation](/docs/reference/encryption).

## Does Jazz use Non-standard cryptography?

Jazz uses BLAKE3, XSalsa20, and Ed25519, which are all widely published and publicly reviewed standard cryptographic algorithms.

Although we're not lawyers, and so can't give legal advice, we believe that Jazz does not use 'Non-standard cryptography' as defined in the [BIS requirements](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-772#p-772.1%28Non-standard%20cryptography%29) and therefore the requirements for publishing Jazz apps in the Apple App Store.


### Encryption
# Encryption

Jazz uses proven cryptographic primitives in a novel, but simple protocol to implement auditable permissions while allowing real-time collaboration and offline editing.

## How encryption works

Jazz uses proven cryptographic primitives in a novel, but simple protocol to implement auditable permissions while allowing real-time collaboration and offline editing.

### Write permissions: Signing with your keys

When you create or modify CoValues, Jazz cryptographically signs every transaction:

* All transactions are signed with your account's signing keypair
* This proves the transaction came from you
* Whether transactions are valid depends on your permissions in the Group that owns the CoValue
* Groups have internal logic ensuring only admins can change roles or create invites
* You can add yourself to a Group only with a specific role via invites

### Read permissions: Symmetric encryption

Groups use a shared "read key" for encrypting data:

* Admins reveal this symmetric encryption key to accounts with "reader" role or higher
* All transactions in CoValues owned by that Group are encrypted with the current read key
* When someone is removed from a Group, the read key rotates and gets revealed to all remaining members
* CoValues start using the new read key for future transactions

This means removed members can't read new data, but existing data they already had access to remains readable to them.

## Key rotation and security

Jazz automatically handles key management:

* **Member removal triggers rotation**: When you remove someone from a Group, Jazz generates a new read key
* **Seamless transition**: New transactions use the new key immediately
* **No data loss**: Existing members get the new key automatically

## Streaming encryption

Jazz encrypts data efficiently for real-time collaboration:

* **Incremental hashing**: CoValue sessions use [BLAKE3](https://github.com/BLAKE3-team/BLAKE3) for append-only hashing
* **Session signatures**: Each session is signed with [Ed25519](https://ed25519.cr.yp.to/) after each transaction
* **Stream ciphers**: Data is encrypted using [XSalsa20](https://cr.yp.to/salsa20.html) stream cipher
* **Integrity protection**: Hashing and signing ensure data hasn't been tampered with

Although we're not lawyers, and so can't give legal advice, the encryption algorithms used in Jazz are widely published. As a result, we believe that Jazz does not use 'Non-standard cryptography' per the [BIS requirements](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-772#p-772.1%28Non-standard%20cryptography%29) (and therefore the requirements for publishing Jazz apps in the Apple App Store).

## Content addressing

CoValue IDs are the [BLAKE3](https://github.com/BLAKE3-team/BLAKE3) hash of their immutable "header" (containing CoValue type and owning group). This allows CoValues to be "content addressed" while remaining dynamic and changeable.

## What this means for you

**Privacy by default**: Your data is always encrypted, even on Jazz Cloud servers. Only people you explicitly give access to can read your data.

**Flexible permissions**: Use Groups to control exactly who can read, write, or admin your CoValues.

**Automatic security**: Key rotation and encryption happen behind the scenes - you don't need to think about it.

**Verifiable authenticity**: Every change is cryptographically signed, so you always know who made what changes.

## Further reading

* [BLAKE3](https://github.com/BLAKE3-team/BLAKE3) \- append-only hashing
* [Ed25519](https://ed25519.cr.yp.to/) \- signature scheme
* [XSalsa20](https://cr.yp.to/salsa20.html) \- stream cipher for data encryption

### Implementation details

The cryptographic primitives are implemented in the [cojson/src/crypto](https://github.com/garden-co/jazz/tree/main/packages/cojson/src/crypto) package.

Key files to explore:

* [permissions.ts](https://github.com/garden-co/jazz/blob/main/packages/cojson/src/permissions.ts) \- Permission logic
* [permissions.test.ts](https://github.com/garden-co/jazz/blob/main/packages/cojson/src/tests/permissions.test.ts) \- Permission tests
* [verifiedState.ts](https://github.com/garden-co/jazz/blob/main/packages/cojson/src/coValueCore/verifiedState.ts) \- State verification
* [coValueCore.test.ts](https://github.com/garden-co/jazz/blob/main/packages/cojson/src/tests/coValueCore.test.ts) \- Core functionality tests


### Testing
# Testing Jazz Apps

As you develop your Jazz app, you might find yourself needing to test functionality relating to sync, identities, and offline behaviour. The `jazz-tools/testing` utilities provide helpers to enable you to do so.

## Core test helpers

Jazz provides some key helpers that you can use to simplify writing complex tests for your app's functionality.

### `setupJazzTestSync`

This should normally be the first thing you call in your test setup, for example in a `beforeEach` or `beforeAll` block. This function sets up an in-memory sync node for the test session, which is needed in case you want to test data synchronisation functionality. Test data is not persisted, and no clean-up is needed between test runs.

```ts
import { co, z } from "jazz-tools";
import { beforeEach, describe, expect, test } from "vitest";
import {
  createJazzTestAccount,
  runWithoutActiveAccount,
  setActiveAccount,
  setupJazzTestSync,
} from "jazz-tools/testing";
const MyAccountSchema = co.account({
  profile: co.profile(),
  root: co.map({}),
});

describe("My app's tests", () => {
  beforeEach(async () => {
    await setupJazzTestSync();
  });

  test("I can create a test account", async () => {
    // See below for details on createJazzTestAccount()
    const account1 = await createJazzTestAccount({
      AccountSchema: MyAccountSchema,
      isCurrentActiveAccount: true,
    });
    expect(account1).not.toBeUndefined();
    // ...
  });
});

```

### `createJazzTestAccount`

After you've created the initial account using `setupJazzTestSync`, you'll typically want to create user accounts for running your tests.

You can use `createJazzTestAccount()` to create an account and link it to the sync node. By default, this account will become the currently active account (effectively the 'logged in' account).

You can use it like this:

```ts
const account = await createJazzTestAccount({
  AccountSchema: MyAccountSchema,
  isCurrentActiveAccount: true,
  creationProps: {},
});

```

#### `AccountSchema`

This option allows you to provide a custom account schema to the utility to be used when creating the account. The account will be created based on the schema, and all attached migrations will run.

#### `isCurrentActiveAccount`

This option (disabled by default) allows you to quickly switch to the newly created account when it is created.

```ts
const account1 = await createJazzTestAccount({
  isCurrentActiveAccount: true,
});

const group1 = co.group().create(); // Group is owned by account1;

const account2 = await createJazzTestAccount();
const group2 = co.group().create(); // Group is still owned by account1;

```

#### `creationProps`

This option allows you to specify `creationProps` for the account which are used during the account creation (and passed to the migration function on creation).

## Managing active Accounts

During your tests, you may need to manage the currently active account after account creation, or you may want to simulate behaviour where there is no currently active account.

### `setActiveAccount`

Use `setActiveAccount()` to switch between active accounts during a test run.

You can use this to test your app with multiple accounts.

```ts
const account1 = await createJazzTestAccount({
  isCurrentActiveAccount: true,
});
const account2 = await createJazzTestAccount();
const group1 = co.group().create(); // Group is owned by account1;
group1.addMember(account2, "reader");

const myMap = MyMap.create(
  {
    text: "Created by account1",
  },
  { owner: group1 },
);
const myMapId = myMap.$jazz.id;

setActiveAccount(account2);
// myMap is still loaded as account1, so we need to load again as account2
const myMapFromAccount2 = await MyMap.load(myMapId);

if (myMapFromAccount2.$isLoaded) {
  expect(myMapFromAccount2.text).toBe("Created by account1");
  expect(() =>
    myMapFromAccount2.$jazz.set("text", "Updated by account2"),
  ).toThrow();
}

```

### `runWithoutActiveAccount`

If you need to test how a particular piece of code behaves when run without an active account.

```ts
const account1 = await createJazzTestAccount({
  isCurrentActiveAccount: true,
});

runWithoutActiveAccount(() => {
  expect(() => co.group().create()).toThrow(); // can't create new group
});

```

## Managing Context

To test UI components, you may need to create a mock Jazz context.

The `TestJazzContextManager` mocks the `JazzContextManager` to allow you to instantiate a Jazz context as a user or a guest, allowing you to run tests which depend on an authenticated or a guest session.

You'll normally use either:

* `TestJazzContextManager.fromAccount(account, props?)` to simulate a logged-in context. You can pass `isAuthenticated: false` as an option to simulate an [anonymous user](docs/key-features/authentication/authentication-states#anonymous-authentication).
* `TestJazzContextManager.fromGuest({ guest }, props?)` to simulate a [guest context](/docs/key-features/authentication/authentication-states#guest-mode).

You can also use `TestJazzContextManager.fromAccountOrGuest()` to allow you to pass either.

### Simulating connection state changes

You can use `MockConnectionStatus.setIsConnected(isConnected: boolean)` to simulate disconnected and connected states (depending on whether `isConnected` is set to `true` or `false`).

## Next Steps

You're ready to start writing your own tests for your Jazz apps now. For further details and reference, you can check how we do our testing below.

* [Unit test examples](https://github.com/garden-co/jazz/tree/main/packages/jazz-tools/src/tools/tests)
* [End-to-end examples](https://github.com/garden-co/jazz/tree/main/tests/e2e/tests)


### Performance tips
# Tips for maximising Jazz performance

## Use the best crypto implementation for your platform

The fastest implementations are (in order):

1. [Node-API crypto](/docs/server-side/setup#node-api) (only available in some Node/Deno environments) or [RNQuickCrypto on React Native](/docs/react-native/project-setup/providers#quick-crypto)
2. [WASM crypto](/docs/server-side/setup#wasm-on-edge-runtimes)
3. JavaScript fallback (slowest, but most compatible)

Check whether your environment supports Node-API. Some edge runtimes may not enable WASM by default.

## Minimise group extensions

Group extensions make it easy to cascade permissions and they’re fast enough for most cases. However, performance can slow down when many parent groups need to load in the dependency chain. To avoid this, create and reuse groups manually when their permissions stay the same for both CoValues over time.

**Note**: Implicit CoValue creation extends groups automatically. Be careful about how you create nested CoValues if you are likely to build long dependency chains.

```ts
const SubSubItem = co.map({
  name: z.string(),
});
const SubItem = co.map({
  subSubItem: SubSubItem,
});
const Item = co.map({
  subItem: SubItem,
});

// Implicit CoValue creation
// Results in Group extension for subItem and subSubItem's owners.
const item = Item.create({
  subItem: {
    subSubItem: {
      name: "Example",
    },
  },
});

// Explicit CoValue creation
// Does not result in Group extension.
const fasterItem = Item.create({
  subItem: SubItem.create({
    subSubItem: SubSubItem.create({
      name: "Example",
    }),
  }),
});

// Alternative
const subSubItem = SubSubItem.create({ name: "Example" });
const subItem = SubItem.create({ subSubItem: subSubItem });
const fasterItem = Item.create({ subItem: subItem });

```

## Choose simple datatypes where possible

CoValues will always be slightly slower to load than their primitive counterparts. For most cases, this is negligible.

In data-heavy apps where lots of data has to be loaded at the same time, you can choose to trade off some of the flexibility of CoValues for speed by opting for primitive data types.

### `z.string()` vs CoTexts

In case you use a CoText, Jazz will enable character-by-character collaboration possibilities for you. However, in many cases, users do not expect to be able to collaborate on the text itself, and are happy with replacing the whole string at once, especially shorter strings. In this case, you could use a `z.string()` for better performance.

Examples:

* names
* URLs
* phone numbers

### `z.object()/z.tuple()` vs CoMaps

CoMaps allow granular updates to objects based on individual keys. If you expect your whole object to be updated at once, you could consider using the `z.object()` or `z.tuple()` type. Note that if you use these methods, you must replace the whole value if you choose to update it.

Examples:

* locations/co-ordinates
* data coming from external sources
* data which is rarely changed after it is created

```ts
const Sprite = co.map({
  position: z.object({ x: z.number(), y: z.number() }),
});

const Location = co.map({
  position: z.tuple([z.number(), z.number()]),
});

const mySprite = Sprite.create({ position: { x: 10, y: 10 } });
mySprite.$jazz.set("position", { x: 20, y: 20 });
// You cannot update 'x' and 'y' independently, only replace the whole object

const myLocation = Location.create({ position: [26.052, -80.209] });
myLocation.$jazz.set("position", [-33.868, -63.987]);
// Note: you cannot replace a single array element, only replace the whole tuple

```


### Forms
# How to write forms with Jazz

This guide shows you a simple and powerful way to implement forms for creating and updating CoValues.

[See the full example here.](https://github.com/garden-co/jazz/tree/main/examples/form)

## Updating a CoValue

To update a CoValue, we simply assign the new value directly as changes happen. These changes are synced to the server.

```tsx
<input
  type="text"
  value={order.name}
  onChange={(e) => order.$jazz.set("name", e.target.value)}
/>;

```

It's that simple!

## Creating a CoValue

When creating a CoValue, we can use a partial version that allows us to build up the data before submitting.

### Using a Partial CoValue

Let's say we have a CoValue called `BubbleTeaOrder`. We can create a partial version,`PartialBubbleTeaOrder`, which has some fields made optional so we can build up the data incrementally.

**File name: schema.ts**

```ts
import { co, z } from "jazz-tools";

export const BubbleTeaOrder = co.map({
  name: z.string(),
});
export type BubbleTeaOrder = co.loaded<typeof BubbleTeaOrder>;

export const PartialBubbleTeaOrder = BubbleTeaOrder.partial();
export type PartialBubbleTeaOrder = co.loaded<typeof PartialBubbleTeaOrder>;

```

## Writing the components in React

Let's write the form component that will be used for both create and update.

```tsx
import { co } from "jazz-tools";
import { BubbleTeaOrder, PartialBubbleTeaOrder } from "./schema";

export function OrderForm({
  order,
  onSave,
}: {
  order: BubbleTeaOrder | PartialBubbleTeaOrder;
  onSave?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSave || ((e) => e.preventDefault())}>
      <label>
        Name
        <input
          type="text"
          value={order.name}
          onChange={(e) => order.$jazz.set("name", e.target.value)}
          required
        />
      </label>

      {onSave && <button type="submit">Submit</button>}
    </form>
  );
}

```

### Writing the edit form

To make the edit form, simply pass the `BubbleTeaOrder`. Changes are automatically saved as you type.

```tsx
export function EditOrder(props: { id: string }) {
  const order = useCoState(BubbleTeaOrder, props.id);

  if (!order.$isLoaded) return;

  return <OrderForm order={order} />;
}

```

### Writing the create form

For the create form, we need to:

1. Create a partial order.
2. Edit the partial order.
3. Convert the partial order to a "real" order on submit.

Here's how that looks like:

```tsx
export function CreateOrder(props: { id: string }) {
  const orders = useAccount(JazzAccount, {
    resolve: { root: { orders: true } },
    select: (account) => (account.$isLoaded ? account.root.orders : undefined),
  });

  const newOrder = useCoState(PartialBubbleTeaOrder, props.id);

  if (!newOrder.$isLoaded || !orders) return;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert to real order and add to the list
    // Note: the name field is marked as required in the form, so we can assume that has been set in this case
    // In a more complex form, you would need to validate the partial value before storing it
    orders.$jazz.push(newOrder as BubbleTeaOrder);
  };

  return <OrderForm order={newOrder} onSave={handleSave} />;
}

```

## Editing with a save button

If you need a save button for editing (rather than automatic saving), you can use Jazz's branching feature. The example app shows how to create a private branch for editing that can be merged back when the user saves:

```tsx
import { Group } from "jazz-tools";
import { useState, useMemo } from "react";

export function EditOrderWithSave(props: { id: string }) {
  // Create a new group for the branch, so that every time we open the edit page,
  // we create a new private branch
  const owner = useMemo(() => Group.create(), []);

  const order = useCoState(BubbleTeaOrder, props.id, {
    resolve: {
      addOns: { $each: true, $onError: "catch" },
      instructions: true,
    },
    unstable_branch: {
      name: "edit-order",
      owner,
    },
  });

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!order.$isLoaded) return;

    // Merge the branch back to the original
    order.$jazz.unstable_merge();
    // Navigate away or show success message
  }

  function handleCancel() {
    // Navigate away without saving - the branch will be discarded
  }

  if (!order.$isLoaded) return;

  return <OrderForm order={order} onSave={handleSave} />;
}

```

This approach creates a private branch using `unstable_branch` with a unique owner group. The user can edit the branch without affecting the original data, and changes are only persisted when they click save via `unstable_merge()`.

**Info:** 

**Important:** Version control is currently unstable and we may ship breaking changes in patch releases.

## Handling different types of data

Forms can be more complex than just a single string field, so we've put together an example app that shows you how to handle single-select, multi-select, date, boolean inputs, and rich text.

[See the full example here.](https://github.com/garden-co/jazz/tree/main/examples/form)


### Organization/Team
# How to share data between users through Organizations

This guide shows you how to share a set of CoValues between users. Different apps have different names for this concept, such as "teams" or "workspaces".

We'll use the term Organization.

[See the full example here.](https://github.com/garden-co/jazz/tree/main/examples/organization)

## Defining the schema for an Organization

Create a CoMap shared by the users of the same organization to act as a root (or "main database") for the shared data within an organization.

For this example, users within an `Organization` will be sharing `Project`s.

**File name: schema.ts**

```ts
export const Project = co.map({
  name: z.string(),
});

export const Organization = co.map({
  name: z.string(),

  // shared data between users of each organization
  projects: co.list(Project),
});

export const ListOfOrganizations = co.list(Organization);

```

Learn more about [defining schemas](/docs/core-concepts/covalues/overview).

## Adding a list of Organizations to the user's Account

Let's add the list of `Organization`s to the user's Account `root` so they can access them.

```tsx
export const JazzAccountRoot = co.map({
  organizations: co.list(Organization),
});

export const JazzAccount = co
  .account({
    root: JazzAccountRoot,
    profile: co.profile(),
  })
  .withMigration((account) => {
    if (!account.$jazz.has("root")) {
      // Using a Group as an owner allows you to give access to other users
      const organizationGroup = Group.create();

      const organizations = co.list(Organization).create([
        // Create the first Organization so users can start right away
        Organization.create(
          {
            name: "My organization",
            projects: co.list(Project).create([], organizationGroup),
          },
          organizationGroup,
        ),
      ]);
      account.$jazz.set("root", { organizations });
    }
  });

```

This schema now allows users to create `Organization`s and add `Project`s to them.

[See the schema for the example app here.](https://github.com/garden-co/jazz/blob/main/examples/organization/src/schema.ts)

## Adding members to an Organization

Here are different ways to add members to an `Organization`.

* Send users an invite link.
* [The user requests to join.](/docs/permissions-and-sharing/sharing#requesting-invites)

This guide and the example app show you the first method.

### Adding members through invite links

Here's how you can generate an [invite link](/docs/permissions-and-sharing/sharing#invites).

When the user accepts the invite, add the `Organization` to the user's `organizations` list.

```ts
import { consumeInviteLink } from "jazz-tools";

consumeInviteLink({
inviteURL: inviteLink,
invitedObjectSchema: Organization, // Pass the schema for the invited object
}).then(async (invitedObject) => {
if (!invitedObject) throw new Error("Failed to consume invite link");
const organization = await Organization.load(invitedObject?.valueID);
me.root.organizations.$jazz.push(organization);
});

```

## Further reading

* [Allowing users to request an invite to join a Group](/docs/permissions-and-sharing/sharing#requesting-invites)
* [Groups as permission scopes](/docs/permissions-and-sharing/overview#adding-group-members-by-id)


### History Patterns
# History Patterns

Jazz's automatic history tracking enables powerful patterns for building collaborative features. Here's how to implement common history-based functionality.

## Audit Logs

Build a complete audit trail showing all changes to your data:

```ts
function getAuditLog(task: Task) {
  const changes: {
    field: string;
    value: Task[keyof Task] | undefined;
    by: Account | null;
    at: Date;
  }[] = [];

  // Collect edits for all fields
  const fields = Object.keys(task);
  const edits = task.$jazz.getEdits();
  for (const field of fields) {
    const editField = field as keyof typeof edits;
    if (!edits[editField]) continue;

    for (const edit of edits[editField].all) {
      changes.push({
        field,
        value: edit.value,
        by: edit.by,
        at: edit.madeAt,
      });
    }
  }

  // Sort by timestamp (newest first)
  return changes.sort((a, b) => b.at.getTime() - a.at.getTime());
}

// Use it to show change history
const auditLog = getAuditLog(task);
auditLog.forEach((entry) => {
  if (!entry.by?.profile?.$isLoaded) return;
  const when = entry.at.toLocaleString();
  const who = entry.by.profile.name;
  const what = entry.field;
  const value = entry.value;

  console.log(`${when} - ${who} changed ${what} to "${value}"`);
  // 22/05/2025, 12:00:00 - Alice changed title to "New task"
});

```

## Activity Feeds

Show recent activity across your application:

```ts
function getRecentActivity(projects: Project[], since: Date) {
  const activity: {
    project: string;
    field: string;
    value: Task[keyof Task] | undefined;
    by: Account | null;
    at: Date;
  }[] = [];

  for (const project of projects) {
    // Get all fields that might have edits
    const fields = Object.keys(project);

    // Check each field for edit history
    const edits = project.$jazz.getEdits();
    for (const field of fields) {
      const editField = field as keyof typeof edits;
      // Skip if no edits exist for this field
      if (!edits[editField]) continue;

      for (const edit of edits[editField].all) {
        // Only include edits made after the 'since' date
        if (edit.madeAt > since) {
          activity.push({
            project: project.name,
            field,
            value: edit.value,
            by: edit.by,
            at: edit.madeAt,
          });
        }
      }
    }
  }

  return activity.sort((a, b) => b.at.getTime() - a.at.getTime());
}

// Show activity from the last hour
const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
const recentActivity = getRecentActivity(myProjects, hourAgo);
// [{
//   project: "New project",
//   field: "name",
//   value: "New project",
//   by: Account,
//   at: Date
// }]

```

## Change Indicators

Show when something was last updated:

```ts
function getLastUpdated(task: Task) {
  // Find the most recent edit across all fields
  let lastEdit: CoMapEdit<unknown> | null = null;

  const edits = task.$jazz.getEdits();
  for (const field of Object.keys(task)) {
    const editField = field as keyof typeof edits;
    // Skip if no edits exist for this field
    if (!edits[editField]) continue;

    const fieldEdit = edits[editField];
    if (fieldEdit && (!lastEdit || fieldEdit.madeAt > lastEdit.madeAt)) {
      lastEdit = fieldEdit;
    }
  }

  if (!lastEdit || !lastEdit.by?.profile?.$isLoaded) return null;

  return {
    updatedBy: lastEdit.by.profile.name,
    updatedAt: lastEdit.madeAt,
    message: `Last updated by ${lastEdit.by.profile.name} at ${lastEdit.madeAt.toLocaleString()}`,
  };
}

const lastUpdated = getLastUpdated(task);
console.log(lastUpdated?.message);
// "Last updated by Alice at 22/05/2025, 12:00:00"

```

## Finding Specific Changes

Query history for specific events:

```ts
// Find when a task was completed
function findCompletionTime(task: Task): Date | null {
  const statusEdits = task.$jazz.getEdits().status;
  if (!statusEdits) return null;

  // find() returns the FIRST completion time
  // If status toggles (completed → in-progress → completed),
  // this gives you the earliest completion, not the latest
  const completionEdit = statusEdits.all.find(
    (edit) => edit.value === "completed",
  );

  return completionEdit?.madeAt || null;
}

// To get the LATEST completion time instead reverse the array, then find:
function findLatestCompletionTime(task: Task): Date | null {
  const statusEdits = task.$jazz.getEdits().status;
  if (!statusEdits) return null;

  // Reverse and find (stops at first match)
  const latestCompletionEdit = statusEdits.all
    .slice() // Create copy to avoid mutating original
    .reverse()
    .find((edit) => edit.value === "completed");

  return latestCompletionEdit?.madeAt || null;
}

console.log(findCompletionTime(task)); // First completion
console.log(findLatestCompletionTime(task)); // Most recent completion

// Find who made a specific change
function findWhoChanged(task: Task, field: string, value: any) {
  const taskEdits = task.$jazz.getEdits();
  const fieldEdits = taskEdits[field as keyof typeof taskEdits];
  if (!fieldEdits) return null;

  const matchingEdit = fieldEdits.all.find((edit) => edit.value === value);
  return matchingEdit?.by || null;
}
const account = findWhoChanged(task, "status", "completed");
if (account?.profile?.$isLoaded) {
  console.log(account.profile.name);
}
// Alice

```

## Further Reading

* [History](/docs/key-features/history) \- Complete reference for the history API
* [Subscription & Loading](/docs/core-concepts/subscription-and-loading) \- Ensure CoValues are loaded before accessing history


## Resources

- [Documentation](https://jazz.tools/docs): Detailed documentation about Jazz
- [Examples](https://jazz.tools/examples): Code examples and tutorials

## chat Example

### apiKey.ts

```ts
export const apiKey =
  import.meta.env.VITE_JAZZ_API_KEY ?? "chat-example-jazz@garden.co";

```

### app.tsx

```tsx
import { apiKey } from "@/apiKey.ts";
import { getRandomUsername, inIframe, onChatLoad } from "@/util.ts";
import { useIframeHashRouter } from "hash-slash";
import { co, getLoadedOrUndefined, Group } from "jazz-tools";
import { JazzInspector } from "jazz-tools/inspector";
import { JazzReactProvider, useAccount, useLogOut } from "jazz-tools/react";
import { StrictMode, useId, useMemo, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import Jazzicon from "react-jazzicon";
import { ChatScreen } from "./chatScreen.tsx";
import { Chat, Message } from "./schema.ts";
import { ThemeProvider } from "./themeProvider.tsx";
import { AppContainer, TopBar } from "./ui.tsx";

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const AccountWithProfile = co.account().resolved({
  profile: true,
});

export function App() {
  const me = useAccount(AccountWithProfile);
  const logOut = useLogOut();
  const router = useIframeHashRouter();
  const inputId = useId();
  const [localValue, setLocalValue] = useState("");
  const [inputWidth, setInputWidth] = useState(120);
  const spanRef = useRef<HTMLSpanElement>(null);

  const profile = getLoadedOrUndefined(me)?.profile;

  const avatarSeed = useMemo(() => {
    if (!me?.$jazz?.id) return 0;
    return stringToSeed(me.$jazz.id);
  }, [me?.$jazz?.id]);

  useEffect(() => {
    setLocalValue(profile?.name ?? "");
  }, [profile?.name]);

  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setInputWidth(Math.max(width + 4, 20));
    }
  }, [localValue]);

  const createChat = () => {
    if (!me) return;
    const group = Group.create();
    group.makePublic("writer");
    const chat = Chat.create([], group);

    chat.$jazz.push(Message.create({ text: "Hello world" }, group));

    router.navigate("/#/chat/" + chat.$jazz.id);

    // for https://jazz.tools marketing site demo only
    onChatLoad(chat);
  };

  const usernamePlaceholder = "Set username";

  return (
    <AppContainer>
      <TopBar>
        <label htmlFor={inputId} className="inline-flex">
          <Jazzicon diameter={28} seed={avatarSeed} />
          <span className="sr-only">Username</span>
        </label>
        <div className="relative">
          <span
            ref={spanRef}
            className="absolute invisible whitespace-pre text-lg"
            aria-hidden="true"
          >
            {localValue || usernamePlaceholder}
          </span>
          <input
            type="text"
            id={inputId}
            value={localValue}
            style={{ width: `${inputWidth}px` }}
            className="bg-transparent text-lg outline-none min-w-0 max-w-full"
            onChange={(e) => {
              setLocalValue(e.target.value);
              if (!profile) return;
              profile.$jazz.set("name", e.target.value);
            }}
            placeholder={usernamePlaceholder}
          />
        </div>
        {!inIframe && (
          <button
            type="button"
            className="cursor-pointer ml-auto"
            onClick={logOut}
          >
            Log out
          </button>
        )}
      </TopBar>
      {router.route({
        "/": () => createChat() as never,
        "/chat/:id": (id) => <ChatScreen chatID={id} />,
      })}
    </AppContainer>
  );
}

const url = new URL(window.location.href);
const defaultProfileName = url.searchParams.get("user") ?? getRandomUsername();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <StrictMode>
      <JazzReactProvider
        authSecretStorageKey="examples/chat"
        sync={{
          peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
        }}
        defaultProfileName={defaultProfileName}
      >
        <App />
        {!inIframe && <JazzInspector />}
      </JazzReactProvider>
    </StrictMode>
  </ThemeProvider>,
);

```

### chatScreen.tsx

```tsx
import { Account, getLoadedOrUndefined } from "jazz-tools";
import { createImage } from "jazz-tools/media";
import { useAccount, useCoState } from "jazz-tools/react";
import { useEffect, useState } from "react";
import { Chat, Message } from "./schema.ts";
import {
  BubbleBody,
  BubbleContainer,
  BubbleImage,
  BubbleInfo,
  BubbleText,
  ChatBody,
  EmptyChatMessage,
  ImageInput,
  InputBar,
  TextInput,
} from "./ui.tsx";

const INITIAL_MESSAGES_TO_SHOW = 30;

const ChatWithMessages = Chat.resolved({
  $each: true,
});

export function ChatScreen(props: { chatID: string }) {
  const chat = useCoState(ChatWithMessages, props.chatID);
  const me = useAccount();
  const [showNLastMessages, setShowNLastMessages] = useState(
    INITIAL_MESSAGES_TO_SHOW,
  );
  const isLoading = useMessagesPreload(props.chatID);

  if (!me.$isLoaded || !chat.$isLoaded || isLoading)
    return (
      <div className="flex-1 flex justify-center items-center">Loading...</div>
    );

  const sendImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    if (file.size > 5000000) {
      alert("Please upload an image less than 5MB.");
      return;
    }

    createImage(file, {
      owner: chat.$jazz.owner,
      progressive: true,
      placeholder: "blur",
    }).then((image) => {
      chat.$jazz.push(
        Message.create(
          {
            text: file.name,
            image: image,
          },
          chat.$jazz.owner,
        ),
      );
    });
  };

  if (!me) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ChatBody>
        {chat.length > 0 ? (
          chat
            // We call slice before reverse to avoid mutating the original array
            .slice(-showNLastMessages)
            // Reverse plus flex-col-reverse on ChatBody gives us scroll-to-bottom behavior
            .reverse()
            .map((msg) =>
              msg.text.$isLoaded ? (
                <ChatBubble me={me} msg={msg} key={msg.$jazz.id} />
              ) : null,
            )
        ) : (
          <EmptyChatMessage />
        )}
        {chat.length > showNLastMessages && (
          <button
            className="px-4 py-1 block mx-auto my-2 border rounded"
            onClick={() => setShowNLastMessages(showNLastMessages + 10)}
          >
            Show more
          </button>
        )}
      </ChatBody>

      <InputBar>
        <ImageInput onImageChange={sendImage} />

        <TextInput
          onSubmit={(text) => {
            chat.$jazz.push(Message.create({ text }, chat.$jazz.owner));
          }}
        />
      </InputBar>
    </>
  );
}

function ChatBubble({ me, msg }: { me: Account; msg: Message }) {
  const { text, image } = msg;
  if (!me.canRead(msg) || !text.$isLoaded) {
    return (
      <BubbleContainer fromMe={false}>
        <BubbleBody fromMe={false}>
          <BubbleText
            text="Message not readable"
            className="text-gray-500 italic"
          />
        </BubbleBody>
      </BubbleContainer>
    );
  }

  const lastEdit = msg.$jazz.getEdits().text;
  const fromMe = lastEdit?.by?.isMe;
  const lastEditor = lastEdit?.by?.profile;
  const lastEditorName = getLoadedOrUndefined(lastEditor)?.name;

  return (
    <BubbleContainer fromMe={fromMe}>
      {lastEdit && <BubbleInfo by={lastEditorName} madeAt={lastEdit.madeAt} />}
      <BubbleBody fromMe={fromMe}>
        {image?.$isLoaded ? <BubbleImage image={image} /> : null}
        <BubbleText text={text} />
      </BubbleBody>
    </BubbleContainer>
  );
}

/**
 * Warms the local cache with the initial messages to load only the initial messages
 * and avoid flickering
 */
function useMessagesPreload(chatID: string) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    preloadChatMessages(chatID).finally(() => {
      setIsLoading(false);
    });
  }, [chatID]);

  return isLoading;
}

async function preloadChatMessages(chatID: string) {
  const chat = await Chat.load(chatID);

  if (!chat.$isLoaded) return;

  const promises = Array.from(chat.$jazz.refs)
    .reverse()
    .slice(0, INITIAL_MESSAGES_TO_SHOW)
    .map((msg) => Message.load(msg.id, { resolve: { text: true } }));

  await Promise.all(promises);
}

```

### index.css

```css
@import "tailwindcss";

/* Custom stone color palette */
@theme {
  --color-stone-50: oklch(0.988281 0.002 75);
  --color-stone-75: oklch(0.980563 0.002 75);
  --color-stone-100: oklch(0.964844 0.002 75);
  --color-stone-200: oklch(0.917969 0.002 75);
  --color-stone-300: oklch(0.853516 0.002 75);
  --color-stone-400: oklch(0.789063 0.002 75);
  --color-stone-500: oklch(0.726563 0.002 75);
  --color-stone-600: oklch(0.613281 0.002 75);
  --color-stone-700: oklch(0.523438 0.002 75);
  --color-stone-800: oklch(0.412109 0.002 75);
  --color-stone-900: oklch(0.302734 0.002 75);
  --color-stone-925: oklch(0.22 0.002 75);
  --color-stone-950: oklch(0.193359 0.002 75);

  /* Blue color overrides */
  --color-blue-50: #eef2ff;
  --color-blue-100: #e0e7ff;
  --color-blue-200: #c7d2fe;
  --color-blue-300: #a5b4fc;
  --color-blue-400: #818cf8;
  --color-blue-500: #5870f1;
  --color-blue-600: #5145cd;
  --color-blue-700: #4338ca;
  --color-blue-800: #3730a3;
  --color-blue-900: #312e81;
  --color-blue-950: #1e1b4b;
  --color-blue: #146aff;
}

@layer base {
  *:focus {
    outline: none;
  }

  :root {
    --border-default: var(--color-stone-200);
  }

  .dark {
    --border-default: var(--color-stone-900);
  }

  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--border-default, currentColor);
  }
}

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

```

### schema.ts

```ts
import { co } from "jazz-tools";

export const Message = co.map({
  text: co.plainText(),
  image: co.optional(co.image()),
});
export type Message = co.loaded<typeof Message>;

export const Chat = co.list(Message);
export type Chat = co.loaded<typeof Chat>;

```

### themeProvider.tsx

```tsx
import { createContext, useContext, useEffect, useState } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: string;
  setTheme: (theme: string) => void;
};

const initialState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: string) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

```

### ui.tsx

```tsx
import clsx from "clsx";
import { CoPlainText, ImageDefinition } from "jazz-tools";
import { Image } from "jazz-tools/react";
import { ImageIcon, SendIcon } from "lucide-react";
import { useId, useRef } from "react";
import { inIframe } from "@/util.ts";

export function AppContainer(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between w-screen h-screen bg-stone-100 dark:bg-stone-925 dark:text-white">
      {props.children}
    </div>
  );
}

export function TopBar(props: { children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "px-3 pt-2 pb-3 bg-stone-100 w-full flex justify-center items-center gap-2 dark:bg-transparent dark:border-stone-900",
        inIframe &&
          "absolute top-0 left-0 right-0 z-100 from-25% from-stone-100 to-stone-100/0 dark:from-stone-925 dark:to-stone-925/0 bg-gradient-to-b",
      )}
    >
      {props.children}
    </div>
  );
}

export function ChatBody(props: { children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "flex-1 overflow-y-auto flex flex-col-reverse",
        inIframe && "no-scrollbar",
      )}
      role="application"
    >
      {props.children}
    </div>
  );
}

export function EmptyChatMessage() {
  return (
    <div className="h-full text-base text-stone-500 flex items-center justify-center px-3 md:text-2xl">
      Start a conversation below.
    </div>
  );
}

export function BubbleContainer(props: {
  children: React.ReactNode;
  fromMe: boolean | undefined;
}) {
  const align = props.fromMe ? "items-end" : "items-start";
  return (
    <div className={`${align} flex flex-col m-3`} role="row">
      {props.children}
    </div>
  );
}

export function BubbleBody(props: {
  children: React.ReactNode;
  fromMe: boolean | undefined;
}) {
  return (
    <div
      className={clsx(
        "line-clamp-10 text-ellipsis whitespace-pre-wrap",
        "rounded-2xl overflow-hidden max-w-[calc(100%-5rem)] shadow-sm p-1",
        props.fromMe
          ? "bg-white dark:bg-stone-900 dark:text-white"
          : "bg-blue text-white",
      )}
    >
      {props.children}
    </div>
  );
}

export function BubbleText(props: {
  text: CoPlainText | string;
  className?: string;
}) {
  return (
    <p className={clsx("px-2 leading-relaxed", props.className)}>
      {props.text}
    </p>
  );
}

export function BubbleImage(props: { image: ImageDefinition }) {
  return (
    <Image
      imageId={props.image.$jazz.id}
      className="h-auto max-h-80 max-w-full rounded-t-xl mb-1"
      height="original"
      width="original"
    />
  );
}

export function BubbleInfo(props: { by: string | undefined; madeAt: Date }) {
  return (
    <div className="text-xs text-neutral-500 mb-1.5">
      {props.by} ·{" "}
      {props.madeAt.toLocaleTimeString("en-US", {
        hour12: false,
      })}
    </div>
  );
}

export function InputBar(props: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-3 pt-1 bg-stone-100 mt-auto flex gap-1 dark:bg-transparent dark:border-stone-900">
      {props.children}
    </div>
  );
}

export function ImageInput({
  onImageChange,
}: {
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Send image"
        title="Send image"
        onClick={onUploadClick}
        className="text-stone-500 dark:text-stone-400 h-10 w-10 grid place-items-center cursor-pointer rounded-full hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-900 dark:hover:text-stone-200 transition-colors"
      >
        <ImageIcon size={20} strokeWidth={1.5} />
      </button>

      <label className="sr-only">
        Image
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/gif"
          onChange={onImageChange}
        />
      </label>
    </>
  );
}

export function TextInput(props: { onSubmit: (text: string) => void }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const input = inputRef.current;
    if (!input?.value) return;
    props.onSubmit(input.value);
    input.value = "";
  };

  return (
    <div className="flex-1 relative">
      <label className="sr-only" htmlFor={inputId}>
        Type a message and press Enter
      </label>
      <input
        ref={inputRef}
        id={inputId}
        className="rounded-full h-10 px-4 border border-stone-400 block w-full placeholder:text-stone-500 dark:bg-stone-925 dark:text-white dark:border-stone-900"
        placeholder="Message"
        maxLength={2048}
        onKeyDown={({ key }) => {
          if (key !== "Enter") return;
          handleSubmit();
        }}
      />

      <button
        type="button"
        onClick={handleSubmit}
        aria-label="Send message"
        title="Send message"
        className="text-stone-500 dark:text-stone-400 absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center cursor-pointer rounded-full hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-900 dark:hover:text-stone-200 transition-colors"
      >
        <SendIcon className="size-4" />
      </button>
    </div>
  );
}

```

### util.ts

```ts
// This is only for demo purposes for https://jazz.tools
// This is NOT needed to make the chat work

import { Chat } from "@/schema.ts";

export function onChatLoad(chat: Chat) {
  if (window.parent) {
    chat.$jazz.waitForSync().then(() => {
      window.parent.postMessage(
        { type: "chat-load", id: "/chat/" + chat.$jazz.id },
        "*",
      );
    });
  }
}

export const inIframe = window.self !== window.top;

const animals = [
  "elephant",
  "penguin",
  "giraffe",
  "octopus",
  "kangaroo",
  "dolphin",
  "cheetah",
  "koala",
  "platypus",
  "pangolin",
];

export function getRandomUsername() {
  return `Anonymous ${animals[Math.floor(Math.random() * animals.length)]}`;
}

```

### vite-env.d.ts

```ts
/// <reference types="vite/client" />

```
