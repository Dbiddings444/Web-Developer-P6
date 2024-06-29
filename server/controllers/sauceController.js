const Sauce = require('../models/sauce');
const dotenv = require('dotenv'); 

dotenv.config({ path: '.env' });

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        const mappedProducts = sauces.map((sauce) => {
          return sauce;
        });
        res.status(200).json(mappedProducts);
      }
    ).catch(
      () => {
        res.status(500).send(new Error('Database error!'));
      }
    );
  };
  
  exports.getOneSauce = (req, res, next) => {
    Sauce.findById(req.params.id).then(
      (sauce) => {
        if (!sauce) {
          return res.status(404).send(new Error('Sauce not found!'));
        }
        res.status(200).json(sauce);
      }
    ).catch(
      () => {
        res.status(500).send(new Error('Database error!'));
      }
    )
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.findById(req.params.id).then(
      (sauce) => {
        if (!sauce) {
          return res.status(404).send(new Error('Sauce not found!'));
        }
        res.status(200).json({ message: 'Sauce deleted successfully' });
      }
    ).catch(
      () => {
        res.status(500).send(new Error('Database error!'));
      }
    )
  };  

