package com.homestay.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class LoginDTO {
    @NotBlank(message = "用户名或邮箱不能为空")
    private String usernameOrEmail;
    
    @NotBlank(message = "密码不能为空")
    private String password;
}
