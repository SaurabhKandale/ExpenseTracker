import type { ButtonProps as ChakraCloseButtonProps } from "@chakra-ui/react"
import { IconButton as ChakraIconButton } from "@chakra-ui/react"
import { CloseCircle } from "iconsax-react"
import * as React from "react"

export interface CloseButtonProps extends ChakraCloseButtonProps {}

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  return (
    <ChakraIconButton variant="plain" aria-label="Close" ref={ref} {...props}>
      {props.children ?? <CloseCircle size={'24px'} />}
    </ChakraIconButton>
  )
})
