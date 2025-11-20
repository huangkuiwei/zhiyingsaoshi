export const token = async () => {
  const res = await uni.request({
    url: '/api/user/token',
    method: 'POST'
  })
  console.log( res )
}