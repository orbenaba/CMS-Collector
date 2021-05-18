// if the user is logged int then its id is defined
export const IsLoggedIn = (objUser) => {
    return !!objUser._id;
}