export interface FriendProps {
    email: string;
    name: string;
    available : boolean;
    about?: string;
    imageAddress?: string;
}
const dummyFriendsData : Array<FriendProps>= [
    {
        email: 'shalomyafyuf@gmail.com',
        name: 'Shalom Hayafyuf',
        available: true,
        about: 'hi, im moshiko and im your friend :) what fun time we had once ',
        imageAddress: 'https://img.wcdn.co.il/f_auto,w_1200,t_54/5/1/0/6/510606-46.jpg'
        
    } ,
    {
        email: 'jiniharari@gmail.com',
        name: 'Jini Harari',
        available: true,
        about: 'hi, im martziano and im your friend :) what fun time we had once ',
        imageAddress: 'https://pbs.twimg.com/profile_images/1157582167259668480/wYxsxZlq.jpg'
    } ,
    {
        email: 'x',
        name: 'kofiko',
        available: false,
        about: 'hi, im kofiko and im your friend :) what fun time we had once ',
        
    } ,
    
    {
        email: 'tomdamri@gmail.com',
        name: 'tom',
        available: false,
        about: 'hi, im tom and im your friend :) what fun time we had once ',
        
    } ,    {
        email: 'x',
        name: 'alex',
        available: true,
        about: 'hi, im alex and im your friend :) what fun time we had once ',
        
    } ,
    {
        email: 'x',
        name: 'tomer',
        available: true,
        about: 'hi, im tomer and im your friend :) what fun time we had once ',
        
    } ,
    {
        email: 'x',
        name: 'matan',
        available: true,
        about: 'hi, im matan and im your friend :) what fun time we had once ',
        
    } ,
]

export const getImageAddress = (friend: FriendProps) => {
    return '';
}


export const getFriends = () => {
    return dummyFriendsData
}