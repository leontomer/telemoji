export interface FriendProps {
    email: string;
    name: string;
    available : boolean;
}
const dummyFriendsData : Array<FriendProps>= [
    {
        email: 'x',
        name: 'moshiko',
        available: true,
        
    } ,
    {
        email: 'x',
        name: 'david',
        available: true,
    } ,
    {
        email: 'x',
        name: 'kofiko',
        available: false,
        
    } ,
    
    {
        email: 'tomdamri@gmail.com',
        name: 'tom',
        available: false,
        
    } ,    {
        email: 'x',
        name: 'alex',
        available: true,
        
    } ,
    {
        email: 'x',
        name: 'tomer',
        available: true,
        
    } ,
    {
        email: 'x',
        name: 'matan',
        available: true,
        
    } ,
]

export const getImageAddress = (friend: FriendProps) => {
    return '';
}


export const getFriends = () => {
    return dummyFriendsData
}