var express = require('express');
var bcrypt = require('bcryptjs');
var auth = require('../../module/auth');
var config = require('../../config/config');
var router = express.Router();

router.get('/', auth.requireLoggedIn, auth.requireRole("Beheerder"), function(req, res, next) {
  
    var db = req.app.locals.connection;

    db.query('SELECT m.*, r.naam as rolnaam FROM medewerker as m INNER JOIN rol as r ON m.rol_id = r.id ORDER BY m.achternaam ASC',function(err,rows){
        if(err) return res.status(500).json({ message: 'Er is een fout opgetreden. Probeer het later opnieuw.' });

        res.send(rows);
    });

});

router.post('/', auth.requireLoggedIn, auth.requireRole("Beheerder"), function(req, res, next) {
  
    var db = req.app.locals.connection;
    var query = "INSERT INTO medewerker (voornaam, achternaam, rol_id, gebruikersnaam, wachtwoord";

    var voornaam = config.escape(req.body.voornaam);
    var achternaam = config.escape(req.body.achternaam);
    var rol_id = req.body.rol_id;
    var gebruikersnaam = config.escape(req.body.gebruikersnaam);
    var ww = bcrypt.hashSync(req.body.wachtwoord);

    if(!voornaam || !achternaam || !rol_id || !gebruikersnaam || !ww)
    {
        return res.status(500).json({ message: 'Er staan nog verplichte velden open!' });
    }

    if(req.body.tussenvoegsel)
        query += ", tussenvoegsel";
    
    query += ") VALUES ('" + 
    voornaam + "', '" + 
    achternaam + "', " +
    rol_id + ", '" +
    gebruikersnaam + "', '" +
    ww + "'";

    if(req.body.tussenvoegsel)
    {
        var tussenvoegsel = config.escape(req.body.tussenvoegsel);
        query += ", '" + tussenvoegsel + "'";
    }

    query += ")";

    db.query(query, function(err, rows)
    {
        if(err) return res.status(500).json({ message: 'Er is een fout opgetreden. Probeer het later opnieuw.' });

        res.json({message: "OK"});
    });    

});


router.put('/:id', auth.requireLoggedIn, auth.requireRole("Beheerder"), function(req, res, next) {
  
    var db = req.app.locals.connection;

    var voornaam = config.escape(req.body.voornaam);
    var achternaam = config.escape(req.body.achternaam);
    var rol_id = req.body.rol_id;
    var gebruikersnaam = config.escape(req.body.gebruikersnaam);

    if(!voornaam || !achternaam || !rol_id || !gebruikersnaam)
    {
        return res.status(500).json({ message: 'Er staan nog verplichte velden open!' });
    }

    var query = "UPDATE medewerker SET " +
    "voornaam = '" + voornaam + "'," +
    "achternaam = '" + achternaam + "'," +
    "rol_id = " + rol_id + "," +
    "gebruikersnaam = '" + gebruikersnaam + "'";

    if(req.body.wachtwoord)
    {
        var wachtwoord = req.body.wachtwoord;
        wachtwoord = bcrypt.hashSync(wachtwoord);
        query += ", wachtwoord = '" + wachtwoord + "'";
    }

    if(req.body.tussenvoegsel)
    {
        var tussenvoegsel = config.escape(req.body.tussenvoegsel);
        query += ", tussenvoegsel = '" + tussenvoegsel + "'";
    }

    query += " WHERE id = " + req.params.id;


    db.query(query, function(err, rows)
    {
        if(err) return res.status(500).json({ message: 'Er is een fout opgetreden. Probeer het later opnieuw.' });

        res.json({ message: "OK" });
        
    });
    

});

router.get('/:id', auth.requireLoggedIn, function(req, res, next) {
  
    var db = req.app.locals.connection;

    db.query("SELECT m.*, r.naam as rol FROM medewerker AS m INNER JOIN rol AS r ON m.rol_id = r.id WHERE m.authToken = '" + req.params.id + "' OR m.id = '" + req.params.id + "'",function(err,rows){
        if(err) return res.status(500).json({ message: 'Er is een fout opgetreden. Probeer het later opnieuw.' });

        if(rows.length < 1)
            res.json({message: "Er bestaat geen medewerker met dit id."});
        else
            res.json(rows[0]);
    });

});

router.delete('/:id', auth.requireLoggedIn, auth.requireRole("Beheerder"), function(req, res, next) {
  
    var db = req.app.locals.connection;

    db.query('DELETE FROM medewerker WHERE id = ' + req.params.id,function(err,rows){
        if(err) return res.status(500).json({ message: 'Er is een fout opgetreden. Probeer het later opnieuw.' });

        res.json({message: "OK"});
    });

});

module.exports = router;
