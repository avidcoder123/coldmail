# What is Coldmail?
Coldmail is an alternative email service which allows you to choose a custom e-mail domain name with no cost to you.
# How to Fork?
1. Fork this project.
2. Git Clone.
3. Install Python and Django if you haven't already by running in a Bash Console:
    `$ pip3 install Django`
4. Make your own changes.
5. To test, `cd` into the root directory, run
    `python manage.py runserver 5000`
and navigate to [127.0.0.1:5000](127.0.0.1:5000/).
# How to deploy a Fork?
1. If you haven't already, install Heroku CLI.
2. Coldmail runs on Gunicorn. If you want to use another service, edit `Procfile`.
3. Push your edits to a GitHub repo.
4. Log into Heroku.com, create a project and go to the `Deploy` tab.
5. Link GitHub account, select your repo and click Deploy.
6. In a Bash command line, run
   ` $ heroku ps:scale web=1 --app`
Where `app` is the name of your heroku app.
# View the site
Coldmail is hosted at [coldmail.herokuapp.com](http://coldmail.herokuapp.com).
If you notice any bugs, report it on GitHub or email me on coldmail at `umar@photonco.com`.
