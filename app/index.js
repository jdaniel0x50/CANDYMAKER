var walk = require('klaw');
var path = require('path');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var framework = require('./frameworks.js')
var generators = require('yeoman-generator');

var success = false;

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);

        // This makes `appname` a required argument.
        this.argument('appname', { type: String, required: false });
    },

    //Initialize variables and opening statement
    initializing: function() {
        this.log(chalk.cyan.bold("Barebones ASP.NET Core Application\n"));
        this.log(chalk.cyan("\t<includes: bootstrap, jquery>\n"));
    },

    //Prompt user for any data inputs
    prompting: function() {
        if (this.appname) {
            this.log(chalk.green("App name provided - Skipping prompt"));
        }
        var gen = this;
        var done = this.async();
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Enter your project name\n(Name can not start with a number or special character)',
            validate: function(str) {
                return isNaN(parseInt(str));
            },
            when: function() {
                return !(gen.appname);
            }
        }, {
            type: 'list',
            name: 'version',
            message: 'Choose SDK Version',
            choices: ['2.0.0'],
            store: true 
        }, {
            type: 'list',
            name: 'css',
            message: 'What CSS Framework would you like to use?',
            choices: [{ name: "None" }, framework.skeleton, framework.bootstrap],
            store: true
        }, {
            type: 'list',
            name: 'jquery',
            message: 'Would you like to enable jQuery?',
            choices: ['Yes', 'No'],
            store: true
        },  {
            type: 'input',
            name: 'first_app',
            message: 'What is the name of the first app you would like to create (this will be the model and controller name) [use SINGULAR form]?',
            store: true
        }, {
            type: 'input',
            name: 'first_app_plural',
            message: 'Type the plural version of the app name you just provided for the first app [use PLURAL form]',
            store: true
        },  {
            type: 'input',
            name: 'database_name',
            message: 'What is the name of the database you will connect to?',
            store: true
        },  {
            type: 'input',
            name: 'password',
            message: 'What is the password to the connecting database?',
            store: true
    }]).then(function(answers) {
            if (answers.name) {
                this.appname = answers.name;
            }
            this.framework = answers.css;
            this.jquery = answers.jquery;
            this.projname = this.appname.trim().charAt(0).toUpperCase() + this.appname.trim().slice(1);
            this.first_app = answers.first_app.trim().charAt(0).toUpperCase() + answers.first_app.trim().slice(1);
            this.first_app_all_lower = answers.first_app.trim().toLowerCase();
            this.first_app_lower_plural = answers.first_app_plural.trim().toLowerCase();
            this.first_app_upper_plural = answers.first_app_plural.trim().charAt(0).toUpperCase() + answers.first_app_plural.trim().toLowerCase().slice(1);
            this.database_name = answers.database_name;
            this.password = answers.password;
            // Stores the user's answer RE: .gitignore
            this.cusGitIgnore = answers.cusGitIgnore;
            this.sourceRoot(path.join(__dirname, answers.version));
            done();
        }.bind(this));
    },

    //Define Paths
    paths: function() {
        this.templatePath('index.js');
    },

    //Write File Systems
    writing: {
        //Build out all folders needed
        scaffoldFolders: function() {
            mkdirp(this.appname + "/Controllers");
            mkdirp(this.appname + "/Factories");
            mkdirp(this.appname + "/Filters");
            mkdirp(this.appname + "/Models");
            mkdirp(this.appname + "/Properties");
            mkdirp(this.appname + "/Views/Shared");
            mkdirp(this.appname + "/Views/Home");
            mkdirp(this.appname + "/Views/" + this.first_app);
            mkdirp(this.appname + "/wwwroot/css");
            mkdirp(this.appname + "/wwwroot/images");
            mkdirp(this.appname + "/wwwroot/js");
        },

        //Add base JS and CSS Files in the wwwroot path
        scaffoldStatic: function() {
            this.fs.copyTpl(
                this.templatePath("_wwwroot/"),
                this.destinationPath(this.appname + '/wwwroot/'), { framework: this.framework, jquery: this.jquery }
            );
        },

        //Bower Files
        bower: function() {
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath(this.appname + '/bower.json'), { title: this.appname, framework: this.framework, jquery: this.jquery }
            );
            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath(this.appname + '/.bowerrc')
            );
        },

        //.csproj File for .NET Core version 1.1+
        csproj: function() {
            this.fs.copy(
                this.templatePath('_project.csproj'),
                this.destinationPath(this.appname + '/' + this.appname + '.csproj')
            )
        },

        //Project.json File for .NET Core version 1.0 
        // jsproject: function() {
        //     this.fs.copy(
        //         this.templatePath('_project.json'),
        //         this.destinationPath(this.appname + '/project.json')
        //     );
        // },

        //Start-up, Program, DbConnector CS Files and appsettings.json
        baseConfig: function() {
            this.fs.copyTpl(
                this.templatePath('_Startup.cs'),
                this.destinationPath(this.appname + '/Startup.cs'), { namespace: this.appname, projname: this.projname }
            );
            this.fs.copyTpl(
                this.templatePath('_Program.cs'),
                this.destinationPath(this.appname + '/Program.cs'), { namespace: this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_DbConnector.cs'),
                this.destinationPath(this.appname + '/DbConnector.cs'), { namespace: this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_appsettings.json'),
                this.destinationPath(this.appname + '/appsettings.json'), { database_name: this.database_name, password: this.password }
            );
        },

        // Adds the .gitignore file
        gitignore: function() {
            this.fs.copy(
                this.templatePath('_.gitignore'),
                this.destinationPath(this.appname + '/.gitignore')
            );
        },

        //Controller Files
        controller: function() {
            this.fs.copyTpl(
                this.templatePath('_Controllers/_HomeController.cs'),
                this.destinationPath(this.appname + '/Controllers/HomeController.cs'), { namespace: this.appname, projname: this.projname }
            );
            this.fs.copyTpl(
                this.templatePath('_Controllers/_ProjectController.cs'),
                this.destinationPath(this.appname + '/Controllers/' + this.first_app + 'Controller.cs'), { namespace: this.appname, projname: this.projname, first_app: this.first_app, first_app_all_lower: this.first_app_all_lower, first_app_plural: this.first_app_lower_plural, first_app_upper_plural: this.first_app_upper_plural }
            );
        },

        //Factory Files
        factories: function () {
            this.fs.copyTpl(
                this.templatePath('_Factories/_IFactory.cs'),
                this.destinationPath(this.appname + '/Factories/IFactory.cs'), { namespace: this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_Factories/_UserFactory.cs'),
                this.destinationPath(this.appname + '/Factories/UserFactory.cs'), { namespace: this.appname }
            );
        },

        //Filter Files
        filters: function () {
            this.fs.copyTpl(
                this.templatePath('_Filters/_ModelStateToTempDataAttribute.cs'),
                this.destinationPath(this.appname + '/Filters/ModelStateToTempDataAttribute.cs'), { namespace: this.appname }
            );
        },

        //Models Files
        models: function () {
            this.fs.copyTpl(
                this.templatePath('_Models/_BaseEntity.cs'),
                this.destinationPath(this.appname + '/Models/BaseEntity.cs'), { namespace: this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_Models/_ModelState.cs'),
                this.destinationPath(this.appname + '/Models/ModelState.cs'), { namespace: this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_Models/_Project.cs'),
                this.destinationPath(this.appname + '/Models/' + this.first_app + '.cs'), { namespace: this.appname, projname: this.projname, first_app: this.first_app }
            );
            this.fs.copyTpl(
                this.templatePath('_Models/_Users.cs'),
                this.destinationPath(this.appname + '/Models/Users.cs'), { namespace: this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_Models/_YourContext.cs'),
                this.destinationPath(this.appname + '/Models/ProjectContext.cs'), { namespace: this.appname, projname: this.projname, first_app: this.first_app, first_app_upper_plural: this.first_app_upper_plural }
            );
        },

        //Properties Files
        properties: function () {
            this.fs.copyTpl(
                this.templatePath('_Properties/_MySqlOptions.cs'),
                this.destinationPath(this.appname + '/Properties/MySqlOptions.cs'), { namespace: this.appname }
            );
        },

        //View Files
        views: function() {
            this.fs.copyTpl(
                this.templatePath('_Views/_Home/_Index.cshtml'),
                this.destinationPath(this.appname + '/Views/Home/Index.cshtml'), { namespace: this.appname }
            );
            this.fs.copyTpl(
                this.templatePath('_Views/_Shared/_Layout.cshtml'),
                this.destinationPath(this.appname + '/Views/Shared/_Layout.cshtml'), { title: this.appname, framework: this.framework, jquery: this.jquery, projname: this.projname, first_app: this.first_app, first_app_all_lower: this.first_app_all_lower, first_app_lower_plural: this.first_app_lower_plural, first_app_upper_plural: this.first_app_upper_plural }
            );
            this.fs.copyTpl(
                this.templatePath('_Views/_ViewImports.cshtml'),
                this.destinationPath(this.appname + '/Views/_ViewImports.cshtml'), { namespace: this.appname }
            );
            this.fs.copy(
                this.templatePath('_Views/_ViewStart.cshtml'),
                this.destinationPath(this.appname + '/Views/_ViewStart.cshtml')
            );
            // var tempRoute = this.templatePath("_Views/");
            // var gen = this;
            // walk(tempRoute)
            // 	.on('data', function(item){
            // 		//if item ends in .cshtml it is one to add
            // 		if(item.path.endsWith(".cshtml")){
            // 			//Remove all underscores from everything after templates as to make proper destination path
            // 			var dest = item.path.split("templates")[1].replace(/_/g,"");
            // 			gen.fs.copy(
            // 	item.path,
            // 	gen.destinationPath(gen.appname + dest)
            // );
            // 		}
            // 	});
        }
    },

    //Run terminal install commmands
    install: function() {
        var gen = this;
        this.log(chalk.blue("Configuring and Installing Bower Packages..."));
        this.bowerInstall('', {
                'config.cwd': ("./" + this.appname)
            },
            function(err) {
                if (err) {
                    console.log(chalk.red(err));
                } else {
                    success = true;
                    console.log(chalk.green("Finished Bower Install!"));
                    //************************************
                    //Disabled Auto-run dotnet restore because it was restoring all projects
                    //in directory where the yeoman generator was run
                    //Plan to re-enable at a later point
                    //************************************
                    // gen.spawnCommand('dotnet', ['restore'], {
                    // 	'config.cwd': (("./" + gen.appname + "/"))
                    // },
                    // function(err){
                    // 	if(err){
                    // 		console.log(chalk.red(err));
                    // 	}else{
                    // 		console.log(chalk.green("Finished DotNet Restore!"));
                    // 	}
                    // });
                }
            });
    },

    //Wrap-up messages
    end: function() {
        var base = chalk.bold(("------------------------") + "\n");
        if (success) {
            this.log(base + chalk.cyan.bold("Base ASP.NET application successfully created\n") + base);
        } else {
            this.log(base + chalk.red.bold("App failed to be created...\nReview Logs above to see what may have gone wrong\n") + base);
        }
    }

    //
    //Possible function to install bower if it does not already exist?
    //
});
