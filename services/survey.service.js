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