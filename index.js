const calc=document.querySelector("#calculate")
const resultContainer=document.querySelector("#result")
let data=[]
let flag=false
const pivot={
    pivotColumn:null,
    pivotRow:null,
    val:["R","S"]
}
const generateTable=()=>{
    const table=document.createElement("div")
    table.classList.add("table")
    const content=`
        <!-- heading row -->
        <span>B.V</span>
        <span>X</span>
        <span>Y</span>
        <span>R</span>
        <span>S</span>
        <span>Z</span>
        <span>R.H.S</span>
        <!-- row 1 -->
        <span>${pivot.val[0]}</span>
        <span>${(Math.floor((data[0][0])*1000))/1000}</span>
        <span>${(Math.floor((data[0][1])*1000))/1000}</span>
        <span>${(Math.floor((data[0][2])*1000))/1000}</span>
        <span>${(Math.floor((data[0][3])*1000))/1000}</span>
        <span>${(Math.floor((data[0][4])*1000))/1000}</span>
        <span>${(Math.floor((data[0][5])*1000))/1000}</span>
        <!-- row 2 -->
        <span>${pivot.val[1]}</span>
        <span>${(Math.floor((data[1][0])*1000))/1000}</span>
        <span>${(Math.floor((data[1][1])*1000))/1000}</span>
        <span>${(Math.floor((data[1][2])*1000))/1000}</span>
        <span>${(Math.floor((data[1][3])*1000))/1000}</span>
        <span>${(Math.floor((data[1][4])*1000))/1000}</span>
        <span>${(Math.floor((data[1][5])*1000))/1000}</span>
        <!-- row 3 -->
        <span></span>
        <span>${(Math.floor((data[2][0])*1000))/1000}</span>
        <span>${(Math.floor((data[2][1])*1000))/1000}</span>
        <span>${(Math.floor((data[2][2])*1000))/1000}</span>
        <span>${(Math.floor((data[2][3])*1000))/1000}</span>
        <span>${(Math.floor((data[2][4])*1000))/1000}</span>
        <span>${(Math.floor((data[2][5])*1000))/1000}</span>
    `
    table.innerHTML=content
    resultContainer.appendChild(table)
}
const appendMessage=(message)=>{
    const h3=document.createElement("h4")
    h3.classList.add("stepDefinition")
    h3.innerHTML=message
    resultContainer.appendChild(h3)
}
const fetch=()=>{
    const a1=parseFloat(document.querySelector("#a1").value)
    const a2=parseFloat(document.querySelector("#a2").value)
    const cnst=[...document.querySelectorAll(".c")]
    const arr=[
        [a1,a2],
        [parseFloat(cnst[0].value),parseFloat(cnst[1].value),parseFloat(cnst[2].value)],
        [parseFloat(cnst[3].value),parseFloat(cnst[4].value),parseFloat(cnst[5].value)],
    ]
    return arr
}
const standardise=(i)=>{
    const arr=[
        [i[1][0]  , i[1][1], 1, 0, 0, i[1][2]],
        [i[2][0]  , i[2][1], 0, 1, 0, i[2][2]],
        [-i[0][0] ,-i[0][1], 0, 0, 1, 0]
    ]
    return arr
}
const findPivotColumn=()=>{
    let Lentry=[
        [data[2][0],0],
        [data[2][1],1]
    ]
    Lentry.sort((a,b)=>{
        return a[0]-b[0]
    })
    // console.log(Lentry)
    if(Lentry[0][0]>=0){
        return null
    }else{
        if(Lentry[0][1]==0){
            appendMessage("Here X is the Pivot Column.")
        }else{
            appendMessage("Here Y is the Pivot Column.")
        }
        return Lentry[0][1]
    }
}
const findPivotRow=()=>{
    // const e1=data[0][pivot.pivotColumn]
    // const e2=data[1][pivot.pivotColumn]
    const arr=[
        [data[0][5]/(data[0][pivot.pivotColumn]),0],
        [data[1][5]/(data[1][pivot.pivotColumn]),1]
    ]
    arr.sort((a,b)=>{
        return a[0]-b[0]
    })
    // we need to find the least positive number (not negative, not zero)
    if(arr[0][0]<=0){
        // return another item's index
        return arr[1][1]
    }else{
        return arr[0][1]
    }
}
const solveNextStep=()=>{
    const otherRow=[0,1,2]
    otherRow.splice(otherRow.indexOf(pivot.pivotRow),1)
    const a=data[pivot.pivotRow][pivot.pivotColumn]
    appendMessage(`R<sub>${pivot.pivotRow+1}</sub> ->  R<sub>${pivot.pivotRow+1}</sub>/(${(Math.floor(a*1000))/1000})`)
    // making the pivot element 1
    for(let i=0;i<6;i++){
        data[pivot.pivotRow][i]/=a
    }
    generateTable()
    // subtracting other two rows in order to make other numbers 0 that lies in the same column of pivot element
    const a1=data[otherRow[0]][pivot.pivotColumn]
    const a2=data[otherRow[1]][pivot.pivotColumn]
    appendMessage(`
        R<sub>${otherRow[0]+1}</sub> ->  R<sub>${otherRow[0]+1}</sub> - (${(Math.floor(a1*1000))/1000})*R<sub>${pivot.pivotRow+1}</sub>
    `)
    appendMessage(`
        R<sub>${otherRow[1]+1}</sub> ->  R<sub>${otherRow[1]+1}</sub> - (${(Math.floor(a2*1000))/1000})*R<sub>${pivot.pivotRow+1}</sub>
    `)
    for(let i=0;i<6;i++){
        data[otherRow[0]][i]-=(a1*(data[pivot.pivotRow][i]))
        data[otherRow[1]][i]-=(a2*(data[pivot.pivotRow][i]))
    }
    generateTable()
}
const simplex=()=>{
    pivot.pivotColumn=findPivotColumn()
    if(pivot.pivotColumn==null){
        // i.e optimal soln is obtained
        let x=0,y=0
        if(pivot.val.indexOf("X")!=-1){
            x=data[pivot.val.indexOf("X")][5]
        }
        if(pivot.val.indexOf("Y")!=-1){
            y=data[pivot.val.indexOf("Y")][5]
        }
        appendMessage(`
            Optimal Soln is obtained.<br>
            Maximise(Z)=${data[2][5]}<br>
            at X=${Math.floor(x*1000)/1000} and Y=${Math.floor(y*1000)/1000}
        `)
        flag=true
    }else{
        // now find the pivot row (data[pivotRow][pivotColumn]=pivot Element)
        pivot.pivotRow=findPivotRow()
        if(pivot.pivotRow==0){
            if(pivot.pivotColumn==0){
               pivot.val[0]="X" 
            }else{
                pivot.val[0]="Y"
            }
        }else{
            if(pivot.pivotColumn==0){
                pivot.val[1]="X" 
             }else{
                 pivot.val[1]="Y"
             }
        }
        appendMessage(`Here R<sub>${pivot.pivotRow+1}</sub> is the Pivot Row and 
        ${Math.floor(data[pivot.pivotRow][pivot.pivotColumn]*1000)/1000} is the pivot Element.`)
        solveNextStep()
    }
}
calc.addEventListener("click",()=>{
    // fetch data
    data =fetch()
    // standardising data for simplex method
    data=standardise(data)
    generateTable()
    while(flag==false){
        simplex()
    }
})