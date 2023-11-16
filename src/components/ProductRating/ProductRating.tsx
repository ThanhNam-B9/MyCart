interface Props {
  rating: number
  activeClassname?: string
  nonActiveClasname?: string
}

export default function ProductRating({
  rating,
  activeClassname = 'fill-yellow-300 text-yellow-300 w-3 h-3',
  nonActiveClasname = 'fill-gray-300 text-gray-300 w-3 h-3'
}: Props) {
  const handleRating = (order: number) => {
    if (order <= rating) {
      return '100%'
    }
    if (order - rating < 1 && order - rating > 0) {
      return (rating - Math.floor(rating)) * 100 + '%'
    }
    return '0%'
  }
  return (
    <div className='flex items-center justity-end'>
      {Array(5)
        .fill(0)
        .map((_, index) => {
          // lam truc tiep
          //   const i = index + 1
          //   const wRating =
          //     rating > i ? '100%' : i - rating < 1 && i - rating > 0 ? `${rating * 10 - (i - 1) * 10}0%` : '0%'

          return (
            <div className='relative' key={index}>
              <div className='absolute top-0 left-0 h-full overflow-hidden' style={{ width: handleRating(index + 1) }}>
                <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x={0} y={0} className={activeClassname}>
                  <polygon
                    points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeMiterlimit={10}
                  />
                </svg>
              </div>
              <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x={0} y={0} className={nonActiveClasname}>
                <polygon
                  points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeMiterlimit={10}
                />
              </svg>
            </div>
          )
        })}
    </div>
  )
}
