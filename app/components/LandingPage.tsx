'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccentColor, ACCENT_COLORS } from '../context/AccentColorContext';

// Add placeholder images for the background gallery
const PLACEHOLDER_IMAGES = [
  'https://lh3.googleusercontent.com/fife/ALs6j_Gq616sp1zlJ75ppkrJFqk4ucrF7B26iUtz7tiGtaUUTgIyUU4lPlZCiSWHEuKfTQLw_NqJzmdnQTmmrt2RCExqfSBArLbUsnPiQvZIECpjofsFDooA13kCQFCLb0dS6G60CeFvjdYe0eT2auwxIsMui1uHaGJGwUExFIrn0ZURGUAK942m9nILA54eiwZZ-RH-DJMml1VkjvU0GAOuPPaHM0bbpWucTz8DIl1FlqoCA9q4XeXqQO66xawBBw9qj7KK0yPKro9LokjiuFUVD_GAt6Iw-cE8MY8ng9xLvaNtYugHSUZARMCo9vSDFSTFcmB418TOXm8kLoAE2a4XJjkZzuLnh9qvkNCOogBbamC5brRXUsQovp74YpUWrZGmXIEXVmEazTmscuxFKZMZcmyDizoLHaM7NjP1-xFoWGAS5nwHMBsWBBajCHIoITLejw9oXAnJDty_gzzndZofKNNJLITRbKRXPdETdvFpQZhqzBv6bS0TZbhue4-RU8JOhFq17p3Z3qlW6_0Gbl1LF_XQYi5waDELRA4X6bwRPVYpyC6GrfqD5um-6FVJm--lCUtgQcni9yLXzHVfIStR0nL4B8rSCxbHZBtrTjiSm6_6j72eCrS9yptRH7zA-R-VL89q8HRp1ELLVot_7pZV7J-Lsct3GrCe5Vq3Zg-6YYgVuf-DE7Qpz0A3rp4INhfeoJspzoqnQGXtH05EpF2A8pDcN5gQx6UOd5nw3Li8xIuq5SMb6rhxth05mnDxnnP35rsmuHExHYnGD5djmyg2gpyB6XVHBbmGFCFTSAIdFpMD9y3zumd4SCcQ23O1iZu1gdrx4jdtUd8XYb3_ZMiQOs4y4DNNCGlwuxTuRcIkLdFNUPNx0S4LCxstLw4h74u-oQaPBFA7MIhT-sWBrvEoc3uzbUm3kd8t6eUybLUypFOio0wMZZNw24E-lNHOETbJwdo6BwbpdbogsxpUgkOnFxzkkzd0Ya1oEMSEVmNo3nzmq3Fk9zxFRqit5RGBj9iS0L9B42z_gaoeNuUrc9paKAeQO-Sw4nTmeXQ1o1b296iizR1yMS-YOJrfP7LHPUIdNfsPABfJAsy173b5Dng-l6rVxLWc-vhKmyh1XyEisgpJPFFPd6_8mrnHY43yep2jQNz_Ufnoo8FNJ-5q7iyt5QLjESUqvIiqmMXhpmiFnP7ryJF2GQ5cn_mGXg1cKaiXKpwzFp-2ARHzOmlhwJWC6oXH-lIeiOf3epcVr2F85JIu48TmTPbb__7DiK0B1_hTDNa0kuBYYr6OOe9RW2xBs2057n5_tb2rS5yknxQV2bLG5H4yD2frQV05svF4pJ4Vq1Csv_olPJRaYz7gnMuBM1ahC86e70MPBiE5ep6T0xoHqblZkD3H4TKxCOmRcS3xKJxCjn525EARbiN8KNti12zhBXpsy9tAzddGc9DL3Lb67cYrHGiwYXhgIL26HJExTCcABGpTrXNUt-eoi2iLrehAzZ36twRMUvHcggSeGtzW4rrH0ZLONhZZv1yzlvI3ymiJNp8UP9z3mviw13QMrl0k8FZOWevw6UaHxaYiDcWnXHlour-gf-kUP1pnMipctofSdm3ewUFp43tLaygo84w4V-r5t8dxT5lxzIsptsb7im-mip3DqPVK=w3000-h6486?auditContext=forDisplay',
  'https://lh3.googleusercontent.com/fife/ALs6j_FGy1bRhTBzfwtvNyG0OJNmwxpFjrvN3pxIXLn3Kn5c7IPGX7uSsbZtOA4PMlkZ8NXO90IZiK2omua70biZ0qOgcuHoXvwKZNZlRItFubxQhachWK3HCJevvz-OpDg9QRPSX64lxoq-h0hmXo6odwblw1g3_5fKBW8lFJGXln9BUnIZlwsckI2dkHszjMyI4mGxB3eRIoPKseF-1c-coufWiQjzLnqy3oSZNq-nM_ayqX6-TacxuHnI3HucKN-OmVUTrmknJf3F6-J7gOvMKRVL_b_PnXowopRNn7SKHOZUFdlpVEH7hzZWv4K6sGQmnIE4_Ym_8eSLkJi_j6spjtvkLjvSOMGCssiZYcILuO5xadJnJhhEZjOiUuGecE_RkZ3ggNwypCuR7K6s8c_jfqLZHFWO0oTIq3b06QhjK4wSar5fyikscZd9gBnATmIAMePyOIZDP6mb4jLOoB3WXXPvnuPdBuqZphC7DNu8_Lq_gxRvFYndPusS04BVi1gfnJzAjN6JcbI0DT_mLbf__aa_NeHl_Zv9Oyzpp0qRK1eK384o6zIGI9Zq5s9g5IY7pt7pOeSi5BGTCopqUg0RGa3-famQl6H2QEDoSo74KQCxQobthtJADQrTaUa3B52m6crcDH4Ds3MBNZ5ZFrTuk3xAJYDB_wXl68fNKheFzKG2wYTbdYVPb-rMOCTPmilYXSuOFkqbgBOb5TznFZW7Xlgcc_obDIAsqSVeRMyYWmdB8Z9_fmkg6mYymhZykSr2Oyxgq0xIUn6W9y2v_nK-spNRP-2IrOxdg8Kph4PiqVSGTHvNAS-EzDfzT33bPMCS2K3wdqMV2TZvNxmYMQXNsLs52GO62gEkg5lk4jCjbzoe45PZLPexYHb3XZw9im7R2XLssa6LGTIuvt7bHOjtBe2XYnpdgAjVOP7wacvtqi1_6xvvxLJ0Hg_mF4ALuZIGtJI0hARU3ZCEvGFpk4IexfhQcGbChKaWRZcheOqrtN3vPxmuQvdRdl6w_Ldl5OK2ljI8Jw71IT72KPzwboT9n9bSZTKXPg62hMwd-kzdAF3VI67Fmp54qB9PnbEXEV3gFV2RbdzWBehh3A7ZS3saKuVejfJuZgAILsTNVg9EjnbLOqrwaD5NpV4JzC0L7E0PPlngj3FYaPbQ0tQgMxGwSstaafIOurCvR1gg4Aim7h2NaXUWe1Mz1kEysFOj9JZFmEkXPkVexy-NrqG-g6Muf6b3zreAFpZWDt8Opnu2EhhOcYmbzav2UQA7B7e4xoad670_UAYHhrBvrFbVSgf3q9u66TUYLEVXYhDJZ_dGpBGzDxoGaz5ytTkLImSq2dj-HV7J4rql1_xHapgUZlbFxAxLN3nrqmJk-1oEZsE7U5t9Zck4BWoPR_ZQRbSn9RhngP_EVkpCZu4GEo93urmCR4tjM8WWR84QSQMutdxbineWOnXg2CKJhZ61A-EDyzNRdNwNk9g0ELVtbCpA8QTi0a52KbeUkNyUwlYTUUrjKL6mB2EdvBXup7PLxup43uxzsJJYa5KWTTyb3bRNe86wczGaFgqdKXXRSAYGQ9_lkhK5AGjK5vuIDtz5E1wNghlPFVLRbnBcU99bime_nsry-iA46FjIh-gz5ayw0-Z4n_modpC1HsSr342z=w1372-h933?auditContext=forDisplay',
  'https://lh3.googleusercontent.com/fife/ALs6j_F9LrL6Dcupy4ULct15FbHk5Pb9RbBQgebVS9vKIrkVy9Oi1Hu4DfdUKEZm-33X6waBeICutGrZo9plVljc22VbiWf5a35O_Enua17x0PdtRQQiAzT__Hcw3PHTBbIMBs_IokXSkD82onZHQyNvXsCGjSqOHoQMQhBEcOVPr9qDfwKmWWE4UYwkg4zyS0ltUtkZFcDGFRayUyi-7ZOVbjdcAH44kQ84F5ffQGWZkHtNEzf5KSE6gXB7BWkk8W_KdaBkMpwGVpDrXczpyxkLLH7HOQv9O6U-sIS1QFxgUWVE3ec8IhZtD_YiBx0uFmqABQK1OqrJ0czSyctwaZWVOSM5QC7VWyq391LqpCEuroVNQ8nvrJVAoBur1a4SZ_FVkGprwovbBncksT6C-tH5IEvjw3_rW2Kron_huvvHymjQZh4hJ5Uuywas4dWdR-47oGGCCblNk80Zvnmn8QJxnCj7sl0OfzqtGmYuupL1hLIcwRI8Dwz_4zSk3v7nr6ObLHwTDIN2UpGjVq2Zcm1mLWtexxd7ODUnGgFinNzkGrayQaX9zoDMjGVChFX6L8wM_5Dn63Dmw-xBp7lYLamyeyJ0hsILwr2ts4gwlRZiXDiEDAAnfbPXsMOt4iq7uYPZdReesWW_vPTEYAn_65pwVtFWB2mFLu8N99N4bwfjt4xElhLntC8EbO_KgwpsE2SiIuinGKgsiBgjGk0SYlymPKi36Mqobj1ZWk9DAQ7ZVwkPSJcRjKqChukCENLaEDa85UPYaUi5vNe51_XIWi9EVYAAF64HvjnPP5dMJfIOqMsq88WDVQZDm99wA3rikPBdV-Xqg0f6VwOb0rf0YRSYQe4zV9vDHHl_uCk_H4zMdwCxzVUqT9YGNiIPTawLywPN8AuQ4WgG5QunXM7RzsQMz9FAkuSlkNr2dzmHajoW13vTzPO0-V0Qj9fasbVW53_jLuFQReVtmEBCXW1FZr8ae2lNjDvaTZ3poBJa7Zr8RSYL7VYC6kJHdBeO8bMLyldM6DCfg9Pj99H2K6TfOzHv0VLDT2tjsR-ZcUAv7pLq-jTp3MRjP6aZ3VVZ5OftIQOLcH_iRg5X23G6U95hgR58jJJRua-JmiOGee0jvO_OlXcpkyVNfY3WrkS6Yf3PiW38SOYciEdUwSvJtWMqkheBpYcvCQDrvJzqlPsfNjcW6RPajg1bU-6kspLsmrlJTLIUQcKKMlnY3AD3MO4j3WOhP0G0lS8ZYSFUHyQY-ddSwj_VZuK3w23TBrOsAqJMU7KaLU4Oscrd8GklZN0Nf1s9RjbupRIuoeZcDGy-LJnxRGkdtJ7j02lp2jG-GCslGKSV9u1seq4Ms_5Ok7Oh_OpbNwfqtzhC_N-sISbN5kFdIi-r5pLdRLEPI3ulTtoaIf_j7nDW3kmmlWoRAbQVRPeI3RxDOEp1N9mdxvE7UyeprETsVw4pK5L0sfrnFxKcZ9y9DbTv4ZSuT9Ja4q0NpSHJnIuAlImNlk5YTmphECfNZxs3SyuDD3lP7fEdctWTQs7_K5_9fwmcr_3agZ7Nw2b3AHdLPFtTFk-981i46uSMt9uz8eQJhEN_3DputKSuLfvPuLnG2Txc19yMw2lWVmjk9mkrpXrtV9ckIqF6FsmWaPbZIDAtulh9_Gc=w1372-h933?auditContext=forDisplay',
  'https://lh3.googleusercontent.com/fife/ALs6j_HZMKpsXt_rs891m11xsOtkKn2IqnWgtcJ7HthJoKW_MgW8BV9Xufq4isH86iN7kVBrLZL3zq-13YwIJsqTRcXc6v1PE3oTF7N21orjS-kv-l29ovnly5y-oiw5lVnq-b6VEBN6Nhel-Pu7Fu8BG8VCZYSFANzYdYDZvB1layaGpfrk-_VmBEGauLrsv4KvL6q8e_Obyll0ZFK8Ne7ci2BgdfNdNvJUgURfFsMLFVUA_1z_tQWkZKVs1do4aqv8CzZnUICPMRaaMWZH74VBYtDE1HNaCa4AIURK8mCMvJT5BkD6_BlK8AmK-Snd3seS3qyVUh59oTj1kKWcTg3a6nmfNTKsJI3nItb2azKsHxvyA7JiXPDyvy9N9Cy60XYIqwLHZJporJGsAnsQBoxdfIkzZvrRahSfDppMISnGXWbMTj2TWYAWXF5DezqKvj_58qb32_kX39mwz67GKSHypbamYGXcVLHzBv8edDJIqc5Tk4IRd2UugL3y2osxCLf6T1ZrtrFJUqWHVHKUzqqR69ig8QqIxIwr8lafQ9hIJbYchY8TLvtqRVZ00Rs9vgjEjMw_gT5DQDv9AXl72f0fM5FN6Ork__dTya2vk12Vysod8DtdzOHA579tIVhh_bIW3fZtMc20dj13WcYx8yHTciwIkJDxsr8rzIDDS0Sw4OhBeeYNlI99YOQGf--Zhk1VDve5bmckwUHwIr3fNgWeQWpmKEHbynC-9ZjlwjQJH0t_4i6ICVZ89d1Asl9gO1ycr2X6b-tdSYCG4T3o7mC6WdSg_IrchDx833X2WmBt3xRV16SKmsvn8hdCdGg026UoJAZso2_0O7fJqj3NcVQIQ0jMsnn_pE-TceryUrBtEqFgsGKFRgp541yh8P2NhJ7rV8rOWdkegOztz-F_awdKZp7Uv73sAP57xIJCEjpbACaKB-k2xowhZg8RqEK9c55mQe2lCaLilfmkO24A-Np9QDui0OTd_JxaocTBMvtQWxiZHpwuTURD-NENCnkaX983icL-aiFOH7XcrxHsGWL7EwsERdHNwpOYM61OVijpxVC7hrJjtR15H4Je8urVI7wt1wBneK82lvbz1AtTS2_YUZLuYwzrQrHNZlJUoWcBVp1FR4wx-oynA45RbBZO0LfR2SrMph3qBBHNWkMNpwQn9Dobhm2zHhZpJHGxGHxxhEaMnpjXDuv-gMjJ-GjTOODcf1vdMTYCn3_OvpHfbgz80dPmU0PY3AF-MtIe8IIpKiL49agb2CWJ8DWSyXmh6PP823h91JQFEcPNfcxWFXjv07di7RPepzQcR0Hdz2xW0CGQm1CJ52-G6XdA2UPppY8M9wRNBUZiew_J_VkRGxXPUd_eHKf06TLjaTohsu2BCWFq_SWvK0D_HfXAMFU39nWFd7Cm_luQahfNcMIBLXfyLVdAg6I_EzjIgkZlhlqvXEAZeMEsJGLc2JV3QImNK8j7Sw-giMJXY4aPGwd12VmaRAOXEwE8QGaX7LsrT8eXvF40sG6haPjx3hQeWupoz8s3VsJ8O-bB4i7MP-ydRIUumedy02d5LIORpZEbOgtRuIuJpBT1i26zRzEjZSjS8L-7QKpfmR1E8AMgFG29Tb4pDZWll6iefnwYlZh1phYKI0m_AooxoJej_eKW=w1372-h933?auditContext=forDisplay',
  'https://lh3.googleusercontent.com/fife/ALs6j_EDQf5kMYrpT7xIXyW739P3YMyYdHLhb1iLpHQh3B0LfmaPLCh4dm0lkrbHN_2W_UOdBL00NOtrTGmXHwNKbNGQpiltWOXICz7JCyK-uNrmVMH0nv7MK4NmvC56OukxJs3YxjlkEHt-NRspgJ8cYBkB7tB68cEJlw0cK8gKZ6ucrnwNE6-urFauO28WVx9FGMrvwKjer6dCTA848RXdIA4x1Rb1B_ed-l6ghn30GHHlhVOCmQVEacg9BisAYbIQSt35M7qGs7zZm0yUDZqdXTWCJ3K-ZFxJtd-MOEJXaOf8M10quP36P0_-12VoeduD0PbfG6mnCmvIi95xAcsQSiydfB0X99oWGER13hQn3vK2b3RIyiDE0tTQQpcGqKW7nshe0kPEj8S56LE04uHXqHcivYeBFCf6Gvbifp1JUhpaXGSYzemm2ymKi5dszxGrt9Ig9pWv8YLzswquEm4UbwxJw_H3HdAtUryPtD622kz2wlDTZSDhpQyUJJaneNdgsluFyZfQQqrF_1pgqqvCd1us5kzt9Fzu4QiKKjyfrutkbBlxRftOHt32W-tBUr4ab_HYP16zvz-FZF6ZcYN9281LcrDpMae7cDfH4ptpyoPsgvIYNEBDUaLfxb6OzCo2z6U-da5iWEakUPtnse_5XZJAV0v_I0-W0gWXBuJ94oSXlKBuRVPH0gNeu9r2MfzaIxk3qL_QZQgSjCmvgT44Ja298QSAEtLFvsG4whgQ1VZGcAY5s50Ohzsjbm6yMiM9mFFBoqSN2c6D21puXeFwyfzJmDw7I_UEPdJbsLiIS8lTNhANTCbist2rkU-4_CXesqEIcBwxOB4Qi_nWJRp8JcSbcXfIZiI9r5QH-WcpnCbMCGfwILTqZugoRZfXRS6UffFCTkFl1EIMa96O5dNO4G4zvkg8QsTPftqDc-FL5AlpJFLv9yDlnOy7_-ofdp1_jLmnlPPBwIlJoKyWEQr5EKmZJG3DuSGPbrcL4CEGNeuKvJ7BpsNNpVmxj49g_DBc2icqYIymDpjNsgfyliJYo_FK7WS0YGN4p8EzwiYxqZcdYY80l_nMSAL0-V8w8XZ9OIRP_AidPB5a0GwBCrPviOfzbkoFdrGD_Blx9odrpaPjxUiUIRWX6FxaVKuNMLWJ-Ugh2J1m1rs9KqZfIaAmu8PdSiiNFl7HmxJeFNLoQus7GDamRllweYpZ9uPRJAuDjXQVO_hHd_deV0wiJaWY962N-cuksREqVkM_Uyig6c-ivJONqAF9T6zi0lbrpTIUGayc4U7Afoj3yjs0wH_QHBRWgy-h-jD0QNq5POAo8117U8SoE3_CREjeAkNKN_VfIGq1o1ANJcTXQUYW1M6250xNkOWbSlD_1NW7Lw0ZbfYjLCJ3tQlfgDffMXjhm3fW9c20gfsk8AXyUqyQGT0vE-c8XPfCadGXTkFtquXYHxmi7FxGDtvZOl-oclWrGwMIMDxpM7luf0FwWwcrf55_jA6W5xGefXYWe_9-HEp7qC9RnRssq0LWwrKHZgpT2t_xFRoPwux-wSD8Jg8MuWFPwKmBAk77HVZAt5npykRCSxtdG8UJnfmbknGf54j7HP0TVaWWM-lyvMYCB2tV5IwGp7NeMM0EZheKBtYheQzv2y3HI7pCIrQIaxCR=w2000-h1258?auditContext=forDisplay',
  'https://lh3.googleusercontent.com/fife/ALs6j_G1VcqFzDkPUm-TXlaW8EDmv2_Q2IiEex0k5nDJm-zNHv8ElRGYetK25v9wPJ0u218xqEzoWlwySymKdw1QAk8xZ71cYPDZSJNFqQXdhfYvZv4NbYIptyDBqDN5MvaDx21y5nPNG8JtJa7clSLzzy1cdK3VHRX7VJyPhfc_3oASZifV7r4geygxpfsLHaG7Z4u77sYxMgYqladWyA20OyLnJzttsJhOhBRJdORqXTg4-4J4GFLAuiejoXBB4bLgD9hmiJr9-XfvrH-nz2KtnpjigXLxisaPsDMbjwEXeUzijop-mjp49h3_BES_mL8BiAQCMoc1WAVMbPLz_y77izuO372Fb2v6QNdwrM805kpfzqm4bSKNCoD7Gnbvqhcs9MoeP2j-Cl-aDutWTUzu_FRlEEJ4yZlgZvdJP3hUM2qheK1SGWRs6vZPdsymKBabNwNsEZjm1lJ6MNGuv7jhH6I7QrE-3e74cN4dzJi66vvZoVXg38CwAHWLgkgpl7y4v_GibpbyeYbkX3AM6Khf3RJ1ZYHtbd70aakg6YtWmwQCk7VpOw5R_1-MOiH8CnJRt9351-AGujPT6iIRabvfkytzVOops7UCGqZUCc8zv6X8epQxLdzz_QxDDpnKkkb1mtpo-SKFEMO_IIqVbjNfCBHzgKOjP3oQa4rRWRn9Vd7PrrvVHOQ6WVuwNKdCwKYrKQZ7g-UvPn1VuZgicycJSYYYPZRnVPBUEdwEquz29rqhY7lPM-Bqx7ujWp4D60IV_JT_MAGCbirZh9H9tAsxJeCiWJDaftgkUk2nY9RhZhGGYD9yxBwdhqBfZ9LRCsoxiCEJhukVyKsRXeLnYMGZUku0nVEFejJmtH6lk5iH5cEezQwuQx-hdmIpByFf6WCraJ8XgK5w-cU9Ph41fnL-_v-7x_2oq0yEZCkHtM8RDk2KQAHwOH4mwDkwuANINvxlfRn-kReYVBRAUaLrOe4hESczBJCFz0Ho_f61gvc2h3R4pbQebVJ2KtlALIfTW8hyWYKo0vLt_TlOltI8hODXB4BY8NVdG1IgbcEXET5ezFTxPTTGFv63j5lOoqG9jQpnljTmwxzhjzy_1l_ymT6dinx766XLNsDS3_34-UO_s1BBMt8cus9qTr_zeIBO1d0Ee5Ah84oBxGo1V8SSH1DTjLXbQun-0wK0ljzhN7s4D8U7rRqqXYwOY3awKlHMB9Xp3P5YX3q5THz0699sDvjF5Xm-lis3iPrvvGT4qGu9OQBWrv_-0O3z6INljLiKQcad3y6Od6LRBqfczYSwDMcKyiH6Gz8P35rubHOF_pBgf0T_3Zjr2_PmziYD85Q3rJOIjbepe-hM6LsPSBw0H7JUbECnXMccDGH0F4Wrlq1_R1oNnMO16VQsnI2s2XM6uOVAJNDc-R8U1hcGwWmRcgGcrJv5S7-f2fo4wxWTzjzcQgleNd1euIUXoPEYTaoF__Bb_QIkhz9ly0KYujtljiqTzSBt9O4ss6kAiz2rPmSnVF79hNjyiOWamjM0vCIBUgnV7yXT1iuPjAWnwae8WMPDEq5Q8SZxsXtf0Hr4BlJEPwIyICPnjPcwlhXk4_3XoSqXfXtX9L0bLKct-K7hdXOd9HikNEIufyct9OBhfXRRrHESbKQCmedKrWwa=w1372-h933?auditContext=forDisplay'
];

const BackgroundGallery = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    window.addEventListener('storage', checkDark);
    window.addEventListener('classChange', checkDark);
    return () => {
      window.removeEventListener('storage', checkDark);
      window.removeEventListener('classChange', checkDark);
    };
  }, []);

  // Repeat images to fill the width
  const repeatedImages = Array(10)
    .fill(PLACEHOLDER_IMAGES)
    .flat();

  // Define mixed speed multipliers for each row (non-linear, varied)
  const ROW_SPEEDS = [1.2, 0.7, 1.5, 0.9, 1.8, 0.6, 1.35, 0.8, 1.65];

  return (
    <div className="fixed left-0 right-0 bottom-0 h-[900px] pointer-events-none z-0 overflow-hidden">
      <div className="absolute left-0 right-0 bottom-0 h-[900px] flex flex-col gap-4 py-2">
        {/* Render 9 rows */}
        {Array.from({ length: 9 }).map((_, rowIdx) => {
          // Offset images for each row to create a different sequence
          const offset = rowIdx % PLACEHOLDER_IMAGES.length;
          const rowImages = [
            ...repeatedImages.slice(offset),
            ...repeatedImages.slice(0, offset),
          ];
          return (
            <div
              key={`row${rowIdx}`}
              className="flex items-start gap-4 h-[120px]"
              style={{
                position: 'relative',
                width: '100%',

              }}
            >
              {/* First group of images */}
              <div
                className="flex items-end gap-4"
                style={{
                  animation: `scrolling${rowIdx} ${400 / ROW_SPEEDS[rowIdx]}s linear infinite`,
                }}
              >
                {rowImages.map((src, index) => (
                  <div key={`row${rowIdx}-${index}`} className="relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg mt-[5px]">
                    <Image
                      src={src}
                      alt={`Background image ${index + 1}`}
                      width={120}
                      height={120}
                      className="object-cover opacity-70"
                      priority
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate group of images */}
              <div
                className="flex items-start gap-4"
                aria-hidden="true"
                style={{
                  animation: `scrolling${rowIdx} ${400 / ROW_SPEEDS[rowIdx]}s linear infinite`,
                }}
              >
                {rowImages.map((src, index) => (
                  <div key={`row${rowIdx}-dup-${index}`} className="relative w-[120px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg mt-[5px]">
                    <Image
                      src={src}
                      alt={`Background image ${index + 1}`}
                      width={120}
                      height={120}
                      className="object-cover opacity-70"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Add dynamic keyframes for each row */}
      <style jsx>{`
        ${Array.from({ length: 9 }).map((_, rowIdx) => `
          @keyframes scrolling${rowIdx} {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `).join('')}
      `}</style>
      {/* Top fade overlay */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[900px] z-10"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0.2) 80%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,1) 60%, rgba(255,255,255,0.2) 80%, transparent 100%)',
        }}
      />
      {/* Bottom fade overlay */}
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-[900px] z-10"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(24,24,24,1) 0%, rgba(24,24,24,0.7) 10%, rgba(24,24,24,0.2) 30%, transparent 60%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 10%, rgba(255,255,255,0.2) 30%, transparent 60%)',
        }}
      />
    </div>
  );
};

interface LandingPageProps {
  onSubmit: (message: string, image: string, model: 'current' | 'google') => void;
}

// Add these styles at the top of the file after the imports
const styles = `
  .form-border-container {
    position: relative;
    width: 100%;
    max-width: 28rem;
    margin: 2rem auto 0;
    display: flex;
    justify-content: center;
  }

  .border {
    position: absolute;
    inset: 0;
    width: 100%;
    max-width: 28rem;
    clip-path: inset(0 0 0 0 round 1rem);
    border-radius: 1rem;
    border: 2px solid #e5e7eb;
    background: transparent;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }
  .dark .border {
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .trail {
    width: 120px;
    height: 12px;
    position: absolute;
    background: linear-gradient(90deg,
      var(--trail-accent, #3b82f6) 0%,
      rgba(var(--trail-rgb, 59,130,246), 0.7) 60%,
      transparent 100%
    );
    border-radius: 6px;
    filter: blur(2px) drop-shadow(0 0 24px var(--trail-accent, #3b82f6));
    offset-path: border-box;
    offset-anchor: 100% 50%;
    animation: journey 10s infinite linear;
    z-index: 2;
    pointer-events: none;
    transform: rotate(180deg);
    will-change: transform;
  }

  @keyframes journey {
    0% {
      offset-distance: 0%;
    }
    25% {
      offset-distance: 25%;
    }
    50% {
      offset-distance: 50%;
    }
    75% {
      offset-distance: 75%;
    }
    100% {
      offset-distance: 100%;
    }
  }

  .content {
    width: 100%;
    max-width: 28rem;
    background: rgba(255,255,255,0.8);
    color: #23272f;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
  }
  .dark .content {
    background: rgba(0, 0, 0, 0.5);
    color: #f3f4f6;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

// Custom hook to ensure we only run on client side
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Move useImageProcessor hook into this file
interface ImageProcessorProps {
  onImageProcessed: (processedImage: string) => void;
}

function useImageProcessor({ onImageProcessed }: ImageProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isClient = useClientOnly();

  const processImage = async (file: File) => {
    if (!isClient) {
      throw new Error('Image processing is only available on the client side');
    }

    setIsProcessing(true);
    try {
      // Dynamically import the modules only when needed
      const [exifrModule, heic2anyModule] = await Promise.all([
        import('exifr'),
        import('heic2any')
      ]);

      let processedFile = file;
      const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || 
                    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

      // Convert HEIC to JPEG if needed
      if (isHeic) {
        try {
          const convertedBlob = await heic2anyModule.default({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          });
          
          // Convert Blob to File
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          processedFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
            type: 'image/jpeg',
            lastModified: file.lastModified
          });
        } catch (conversionError) {
          console.error('Error converting HEIC:', conversionError);
          throw new Error('Error converting HEIC image. Please try a different format.');
        }
      }

      // Get EXIF orientation data
      const orientation = await exifrModule.orientation(processedFile);
      console.log('EXIF Orientation:', orientation); // Debug log

      // Create a new FileReader
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (!event.target?.result) return;
        
        // Create an image element to handle the rotation
        const img = document.createElement('img') as HTMLImageElement;
        
        // Set crossOrigin to anonymous to avoid CORS issues
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          console.log('Original image dimensions:', img.width, 'x', img.height); // Debug log
          
          // Create a canvas to draw the rotated image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) return;

          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the image directly without any transformations
          ctx.drawImage(img, 0, 0);
          
          // Convert to base64
          const correctedImageData = canvas.toDataURL('image/jpeg', 0.9);
          
          // Create a new image to verify the result
          const verifyImg = new window.Image();
          verifyImg.onload = () => {
            console.log('Processed image dimensions:', verifyImg.width, 'x', verifyImg.height); // Debug log
            onImageProcessed(correctedImageData);
          };
          verifyImg.src = correctedImageData;
        };

        // Set the image source
        img.src = event.target.result as string;
      };

      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to original image if there's an error
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        onImageProcessed(imageData);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  return { processImage, isProcessing };
}

export default function LandingPage({ onSubmit }: LandingPageProps) {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { accentColor, setAccentColor } = useAccentColor();
  const [isDark, setIsDark] = useState(false);
  const [model, setModel] = useState<'current' | 'google'>('current');
  const isClient = useClientOnly();
  const { processImage, isProcessing } = useImageProcessor({
    onImageProcessed: (processedImage) => {
      setSelectedImage(processedImage);
    }
  });

  // Set accent color based on model
  useEffect(() => {
    if (!isClient) return;
    if (model === 'google') setAccentColor('blue');
    else setAccentColor('white');
  }, [model, setAccentColor, isClient]);

  // Set the accent color for the trail effect
  useEffect(() => {
    if (!isClient) return;
    let color = model === 'google' ? ACCENT_COLORS.blue.primary : '#e0e0e0';
    function hexToRgb(hex: string) {
      const match = hex.replace('#', '').match(/.{1,2}/g);
      if (!match) return '224,224,224';
      const [r, g, b] = match.map(x => parseInt(x, 16));
      return `${r},${g},${b}`;
    }
    document.documentElement.style.setProperty('--trail-accent', color);
    document.documentElement.style.setProperty('--trail-rgb', hexToRgb(color));
  }, [model, isClient]);

  // Inject styles on client side
  useEffect(() => {
    if (!isClient) return;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    window.addEventListener('storage', checkDark);
    window.addEventListener('classChange', checkDark);
    return () => {
      window.removeEventListener('storage', checkDark);
      window.removeEventListener('classChange', checkDark);
    };
  }, [isClient]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await processImage(file);
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to original image if there's an error
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      return; // Don't submit if there's no input message
    }

    setIsLoading(true);
    onSubmit(input, selectedImage || '', model);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-0">
      <BackgroundGallery />
      <div className="relative z-10 w-full max-w-[98vw] sm:max-w-xl mx-auto px-0 sm:px-0 md:px-4">
        <div className="text-center mb-8">
          <h1
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[6rem] font-bold mb-4 vintage-title"
            style={{ color: isDark ? '#f3f4f6' : '#23272f' }}
          >
            Tattoo Preview
          </h1>
          <p
            className="text-lg vintage-title mt-8"
            style={{ color: isDark ? '#e5e7eb' : '#6b7280' }}
          >
            Transform your ideas into stunning tattoo designs
          </p>
        </div>
        {/* Instructions Section */}
        <div className="form-border-container mb-4">
          <div className="w-full text-sm instructions-tooltip">
            <ul className="list-disc list-inside text-left">
              <li>Upload a photo of yourself or where you want the tattoo.</li>
              <li>Describe the tattoo you want in the text box below.</li>
              <li>Click the arrow button to generate a tattoo preview.</li>
              <li>View and download your custom tattoo design!</li>
            </ul>
          </div>
        </div>
        <div className="initial-load-form">
          <div className="form-border-container">
            <div className="border">
              <div className="trail"></div>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-[99vw] sm:max-w-[28rem] mx-auto p-0 sm:p-4 content">
              {/* Upload button above chat input */}
              {!selectedImage && (
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="upload-button">
                    <span className="material-icons text-sm mr-1">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.65rem', color: '#888', fontWeight: 400, marginRight: '0.25rem' }}>
                      Tattoo Artist: 
                    </span>
                    <button
                      type="button"
                      onClick={() => setModel(m => m === 'current' ? 'google' : 'current')}
                      className={`model-toggle-btn-unified ${model === 'google' ? 'google' : 'current'} px-4 py-2 rounded-full text-sm font-medium transition-colors`}
                      aria-label="Toggle model"
                    >
                      {model === 'current' ?  'OpenAI' : 'Google'}
                    </button>
                  </div>
                </div>
              )}
              <div className="chat-input-container" style={{ position: 'relative', width: '100%' }}>
                {selectedImage && (
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={selectedImage}
                      alt="Selected image"
                      fill
                      className="object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the tattoo you want..."
                  className="chat-input text-sm sm:text-base"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`send-button${model === 'current' ? ' openai-send-button' : ''} ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Send"
                  style={model === 'google' 
                    ? { background: ACCENT_COLORS.blue.primary, color: '#fff' } 
                    : { background: '#fff', color: '#23272f', border: '1px solid #e5e7eb' }}
                >
                  {isLoading ? (
                    <span className="loading-spinner-icon"></span>
                  ) : (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={2} 
                      stroke={model === 'google' ? '#fff' : '#23272f'} 
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Dark mode toggle - moved outside the form container */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              const isDark = document.documentElement.classList.contains('dark');
              if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
              } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
              }
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('classChange'));
            }}
            className="p-2 rounded-full transition-colors bg-[#2a2a2a] hover:bg-[#3a3a3a] dark:bg-gray-200 dark:hover:bg-gray-300"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#2a2a2a]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 