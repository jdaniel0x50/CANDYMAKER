# Candymaker (Update Versioning from CANDYMAN)
One of many C# ASP.NET Core - Yeoman Generators
******
Generator built to offer a very simple project layout and starting place.
Offers the ability to toggle usage of the following front-end packages/frameworks:
 - Bootstrap
 - Skeleton
 - jQuery
 - jQuery Validation
 Offers ability to modify database name, password, and name of first application (Model and Controller names)

### Usage
Download and Save to a location on your drive outside of a Git repository

From the command line, navigate inside the folder containing the project (same level as the package.json file)

Type command > `npm link`

Navigate to the folder you would like to launch your first project

Type command > `yo candymaker`, optionally passing an app name
```
yo candymaker [app=name]
```

Once installed navigate into newly created folder and run ```dotnet restore```

If using a PostGres database run migrations:
dotnet ef migrations add FirstMigration
dotnet ef database update

### License

MIT

------
Originially built for student use at Coding Dojo bootcamp by Dylan Sharkey, dsharkey@codingdojo.com.
Original CANDYMAN Github: https://github.com/serghar
Update made by Joshua Daniel, Nov 2017
Github: https://github.com/jdjustdata/CANDYMAKER
