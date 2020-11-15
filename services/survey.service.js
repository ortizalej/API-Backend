var Survey = require('../dataModel');

// Saving the context of this module inside the _the variable
_this = this

exports.getEncuesta= async function (id, page, limit){
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        console.log("ID: ",id)

        var surveys = await Survey.paginate(id, options)
        // Return the Userd list that was retured by the mongoose promise
        return surveys;

    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Surveys');
    }
}

exports.updateSurvey= async function(encuesta){
    var id = {id :encuesta.id}

    try {
        //Find the old Survey Object by the Id
        var oldEncuesta = await Survey.findOne(id);
    } catch (e) {
        throw Error("Error occured while Finding the Survey")
    }
    // If no old Survey Object exists return false
    if (!oldEncuesta) {
        return false;
    }
   
    oldEncuesta.id = encuesta.id
    oldEncuesta.questions = encuesta.questions
    try {
        var savedEncuesta = await oldEncuesta.save()
        return savedEncuesta;
    } catch (e) {
        throw Error("An Error occured while updating the Survey");
    }

}