const array = ['Party','Trip','Wedding','Project','Other','Seminar']

export function convertNoIntoCategory(num){
    return array[num-1];
}