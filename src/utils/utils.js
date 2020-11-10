// Generates unique guid
export const guid = () =>
{
		function s4()
		{
				return Math.floor((1 + Math.random()) * 0x10000)
				           .toString(16)
				           .substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Shuffle an array
export const shuffle = (array) =>
{
		let i = array.length - 1;
		for(; i > 0; i--)
		{
				const j = Math.floor(Math.random() * (i + 1));
				const temp = array[i];
				array[i] = array[j];
				array[j] = temp;
		}
		return array;
}

export const currentDate = () =>
{
		let newDate = new Date()
		let date = newDate.getDate();
		let month = newDate.getMonth() + 1;
		let year = newDate.getFullYear();
		return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;
}

export const currentDay = (asString) =>
{
		if (!asString)
		{
				return (new Date().getDay() + 1);
		}
		let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		return days[new Date().getDay() + 1];
}

export const currentTime = () =>
{
		let newDate = new Date()
		let hours = newDate.getHours();
		let minutes = newDate.getMinutes();
		return `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
}
