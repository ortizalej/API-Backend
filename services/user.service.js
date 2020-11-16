var User = require('../dataModel');

// Saving the context of this module inside the _the variable
_this = this

exports.loginUser = async function (user) {

    try {
        // Find the User 
        console.log("login:",user)
        var _details = await User.findOne({
            username: user.username
        });
        var passwordIsValid = compareSync(user.password, _details.password);
        if (!passwordIsValid) throw Error("Invalid username/password")

        return {user:_details};
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Login User")
    }

}

exports.deleteUser= async function (id) {

    // Delete the User
    try {
        var deleted = await User.remove({
            _id: id
        })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("User Could not be deleted")
        }
        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the User")
    }
}
