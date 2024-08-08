import { createSystem } from 'frog/ui'
 
export const { Box, Heading, Text, VStack, vars, Image, HStack, Spacer } = createSystem({
    colors: {
        text: '#000000'
    },
    fonts: {
        default: [
            {
                name: 'Sora',
                source: 'google',
                weight: 600,
            },
            {
                name: 'Sora',
                source: 'google',
                weight: 400,
            }
        ]
    }
})