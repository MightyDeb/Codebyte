

const pagination = ({data,itemsPerPage=10,start=0}) => {
  const paginationArray=data.slice(start,Math.min(start+itemsPerPage,data.length))
  return paginationArray
}

export default pagination