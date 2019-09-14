export const GRADE_CHANGE='GRADE_CAHNGE'
export const gradeChange=(data)=>{
    return {
        type:'GRADE_CAHNGE',
        payload:{
            data
        }
    }
}