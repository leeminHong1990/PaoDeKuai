<GameFile>
  <PropertyGroup Name="GPSUI" Type="Layer" ID="2c688124-f43a-4a3c-bebe-1c775e27f4c7" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="208" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="bg_panel" ActionTag="-1440666870" Tag="228" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="178" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="gps_panel" ActionTag="-1411757820" Tag="209" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="80" RightEage="80" TopEage="80" BottomEage="80" Scale9OriginX="80" Scale9OriginY="80" Scale9Width="708" Scale9Height="404" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <Children>
              <AbstractNodeData Name="gps_bg" ActionTag="-1359064191" Tag="210" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="228.0000" RightMargin="228.0000" TopMargin="190.0000" BottomMargin="90.0000" LeftEage="184" RightEage="184" TopEage="100" BottomEage="100" Scale9OriginX="184" Scale9OriginY="100" Scale9Width="456" Scale9Height="240" ctype="ImageViewObjectData">
                <Size X="824.0000" Y="440.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="310.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.4306" />
                <PreSize X="0.6438" Y="0.6111" />
                <FileData Type="Normal" Path="GPSUI/bg_img.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="three_panel" ActionTag="-220932722" Tag="442" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="228.0000" RightMargin="228.0000" TopMargin="190.0000" BottomMargin="90.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="172" RightEage="172" TopEage="87" BottomEage="87" Scale9OriginX="-172" Scale9OriginY="-87" Scale9Width="344" Scale9Height="174" ctype="PanelObjectData">
                <Size X="824.0000" Y="440.0000" />
                <Children>
                  <AbstractNodeData Name="player_panel_0" ActionTag="-1782040677" Tag="443" IconVisible="False" LeftMargin="313.2338" RightMargin="310.7662" TopMargin="209.5496" BottomMargin="30.4504" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="38" BottomEage="38" Scale9OriginX="25" Scale9OriginY="38" Scale9Width="28" Scale9Height="42" ctype="PanelObjectData">
                    <Size X="200.0000" Y="200.0000" />
                    <Children>
                      <AbstractNodeData Name="portrait_sprite" ActionTag="-631700590" Tag="444" IconVisible="False" LeftMargin="64.0000" RightMargin="64.0000" TopMargin="44.0001" BottomMargin="83.9999" ctype="SpriteObjectData">
                        <Size X="72.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="119.9999" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.6000" />
                        <PreSize X="0.3600" Y="0.3600" />
                        <FileData Type="Normal" Path="GPSUI/default_img.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="ip_label" ActionTag="1426971451" Tag="824" IconVisible="False" LeftMargin="-1.0000" RightMargin="1.0000" TopMargin="169.0000" BottomMargin="11.0000" IsCustomSize="True" FontSize="20" LabelText="192.168.255.255" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="200.0000" Y="20.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="99.0000" Y="21.0000" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="132" G="102" B="20" />
                        <PrePosition X="0.4950" Y="0.1050" />
                        <PreSize X="1.0000" Y="0.1000" />
                        <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint />
                    <Position X="313.2338" Y="30.4504" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3801" Y="0.0692" />
                    <PreSize X="0.2427" Y="0.4545" />
                    <FileData Type="Normal" Path="GPSUI/my_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="player_panel_1" ActionTag="-1561134291" VisibleForFrame="False" Tag="445" IconVisible="False" LeftMargin="596.3102" RightMargin="27.6898" TopMargin="-4.9232" BottomMargin="244.9232" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="38" BottomEage="38" Scale9OriginX="25" Scale9OriginY="38" Scale9Width="28" Scale9Height="42" ctype="PanelObjectData">
                    <Size X="200.0000" Y="200.0000" />
                    <Children>
                      <AbstractNodeData Name="portrait_sprite" ActionTag="-1452413914" Tag="446" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="64.0000" RightMargin="64.0000" TopMargin="44.0001" BottomMargin="83.9999" ctype="SpriteObjectData">
                        <Size X="72.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="119.9999" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.6000" />
                        <PreSize X="0.3600" Y="0.3600" />
                        <FileData Type="Normal" Path="GPSUI/default_img.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="ip_label" ActionTag="86594801" Tag="825" IconVisible="False" LeftMargin="-0.0005" RightMargin="0.0005" TopMargin="11.8955" BottomMargin="168.1045" IsCustomSize="True" FontSize="20" LabelText="192.168.255.255" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="200.0000" Y="20.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="99.9995" Y="178.1045" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="132" G="102" B="20" />
                        <PrePosition X="0.5000" Y="0.8905" />
                        <PreSize X="1.0000" Y="0.1000" />
                        <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint />
                    <Position X="596.3102" Y="244.9232" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7237" Y="0.5566" />
                    <PreSize X="0.2427" Y="0.4545" />
                    <FileData Type="Normal" Path="GPSUI/other_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="player_panel_3" ActionTag="-373554967" VisibleForFrame="False" Tag="447" IconVisible="False" LeftMargin="33.3527" RightMargin="590.6473" TopMargin="-5.9741" BottomMargin="245.9741" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="38" BottomEage="38" Scale9OriginX="25" Scale9OriginY="38" Scale9Width="28" Scale9Height="42" ctype="PanelObjectData">
                    <Size X="200.0000" Y="200.0000" />
                    <Children>
                      <AbstractNodeData Name="portrait_sprite" ActionTag="1397714706" Tag="448" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="64.0000" RightMargin="64.0000" TopMargin="44.0001" BottomMargin="83.9999" ctype="SpriteObjectData">
                        <Size X="72.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="119.9999" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.6000" />
                        <PreSize X="0.3600" Y="0.3600" />
                        <FileData Type="Normal" Path="GPSUI/default_img.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="ip_label" ActionTag="2122249950" Tag="826" IconVisible="False" TopMargin="12.9465" BottomMargin="167.0535" IsCustomSize="True" FontSize="20" LabelText="192.168.255.255" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="200.0000" Y="20.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="177.0535" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="132" G="102" B="20" />
                        <PrePosition X="0.5000" Y="0.8853" />
                        <PreSize X="1.0000" Y="0.1000" />
                        <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint />
                    <Position X="33.3527" Y="245.9741" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.0405" Y="0.5590" />
                    <PreSize X="0.2427" Y="0.4545" />
                    <FileData Type="Normal" Path="GPSUI/other_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_0_1" ActionTag="-1150779744" VisibleForFrame="False" Tag="467" RotationSkewX="-40.0000" RotationSkewY="-40.0000" IconVisible="False" LeftMargin="324.0000" RightMargin="30.0000" TopMargin="251.5000" BottomMargin="187.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="559.0000" Y="188.0000" />
                    <Scale ScaleX="0.6500" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.6784" Y="0.4273" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_1_3" ActionTag="-32055004" VisibleForFrame="False" Tag="468" IconVisible="False" LeftMargin="182.0000" RightMargin="172.0000" TopMargin="87.5000" BottomMargin="351.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="417.0000" Y="352.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5061" Y="0.8000" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_0_3" ActionTag="-507259853" VisibleForFrame="False" Tag="469" RotationSkewX="40.0000" RotationSkewY="40.0000" IconVisible="False" LeftMargin="33.0000" RightMargin="321.0000" TopMargin="254.5000" BottomMargin="184.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="268.0000" Y="185.0000" />
                    <Scale ScaleX="0.6500" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3252" Y="0.4205" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_0_1" ActionTag="-633455058" VisibleForFrame="False" Tag="449" RotationSkewX="-39.9980" RotationSkewY="-39.9999" IconVisible="False" LeftMargin="447.5391" RightMargin="176.4609" TopMargin="228.0869" BottomMargin="191.9131" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="547.5391" Y="201.9131" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.6645" Y="0.4589" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_1_3" ActionTag="-1232629407" VisibleForFrame="False" Tag="450" RotationSkewY="-0.0013" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="312.0000" RightMargin="312.0000" TopMargin="60.1000" BottomMargin="359.9000" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="412.0000" Y="369.9000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.5000" Y="0.8407" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_0_3" ActionTag="-4759144" VisibleForFrame="False" Tag="451" RotationSkewX="39.9999" RotationSkewY="39.9968" IconVisible="False" LeftMargin="169.7945" RightMargin="454.2055" TopMargin="215.0551" BottomMargin="204.9449" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="269.7945" Y="214.9449" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.3274" Y="0.4885" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="310.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.4306" />
                <PreSize X="0.6438" Y="0.6111" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="four_panel" ActionTag="-1527809393" VisibleForFrame="False" Tag="452" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="228.0000" RightMargin="228.0000" TopMargin="190.0000" BottomMargin="90.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="20" RightEage="20" TopEage="20" BottomEage="20" Scale9OriginX="-20" Scale9OriginY="-20" Scale9Width="40" Scale9Height="40" ctype="PanelObjectData">
                <Size X="824.0000" Y="440.0000" />
                <Children>
                  <AbstractNodeData Name="player_panel_0" ActionTag="-1279432384" Tag="453" IconVisible="False" LeftMargin="313.2338" RightMargin="310.7662" TopMargin="251.5496" BottomMargin="-11.5496" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="38" BottomEage="38" Scale9OriginX="25" Scale9OriginY="38" Scale9Width="28" Scale9Height="42" ctype="PanelObjectData">
                    <Size X="200.0000" Y="200.0000" />
                    <Children>
                      <AbstractNodeData Name="portrait_sprite" ActionTag="722548424" Tag="454" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="64.0000" RightMargin="64.0000" TopMargin="44.0001" BottomMargin="83.9999" ctype="SpriteObjectData">
                        <Size X="72.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="119.9999" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.6000" />
                        <PreSize X="0.3600" Y="0.3600" />
                        <FileData Type="Normal" Path="GPSUI/default_img.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="ip_label" ActionTag="1701744066" Tag="830" IconVisible="False" LeftMargin="2.7911" RightMargin="-2.7911" TopMargin="156.9785" BottomMargin="23.0215" IsCustomSize="True" FontSize="20" LabelText="192.168.255.255" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="200.0000" Y="20.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="102.7911" Y="33.0215" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="132" G="102" B="20" />
                        <PrePosition X="0.5140" Y="0.1651" />
                        <PreSize X="1.0000" Y="0.1000" />
                        <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint />
                    <Position X="313.2338" Y="-11.5496" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.3801" Y="-0.0262" />
                    <PreSize X="0.2427" Y="0.4545" />
                    <FileData Type="Normal" Path="GPSUI/my_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="player_panel_1" ActionTag="291656459" VisibleForFrame="False" Tag="455" IconVisible="False" LeftMargin="638.3102" RightMargin="-14.3102" TopMargin="121.0000" BottomMargin="119.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="38" BottomEage="38" Scale9OriginX="25" Scale9OriginY="38" Scale9Width="28" Scale9Height="42" ctype="PanelObjectData">
                    <Size X="200.0000" Y="200.0000" />
                    <Children>
                      <AbstractNodeData Name="portrait_sprite" ActionTag="571391091" Tag="456" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="64.0000" RightMargin="64.0000" TopMargin="44.0001" BottomMargin="83.9999" ctype="SpriteObjectData">
                        <Size X="72.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="119.9999" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.6000" />
                        <PreSize X="0.3600" Y="0.3600" />
                        <FileData Type="Normal" Path="GPSUI/default_img.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="ip_label" ActionTag="1371842321" Tag="831" IconVisible="False" LeftMargin="0.0062" RightMargin="-0.0062" TopMargin="161.5864" BottomMargin="18.4136" IsCustomSize="True" FontSize="20" LabelText="192.168.255.255" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="200.0000" Y="20.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0062" Y="28.4136" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="132" G="102" B="20" />
                        <PrePosition X="0.5000" Y="0.1421" />
                        <PreSize X="1.0000" Y="0.1000" />
                        <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint />
                    <Position X="638.3102" Y="119.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7746" Y="0.2705" />
                    <PreSize X="0.2427" Y="0.4545" />
                    <FileData Type="Normal" Path="GPSUI/other_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="player_panel_2" ActionTag="-553045676" VisibleForFrame="False" Tag="462" IconVisible="False" LeftMargin="313.0000" RightMargin="311.0000" TopMargin="-22.0000" BottomMargin="262.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="38" BottomEage="38" Scale9OriginX="25" Scale9OriginY="38" Scale9Width="28" Scale9Height="42" ctype="PanelObjectData">
                    <Size X="200.0000" Y="200.0000" />
                    <Children>
                      <AbstractNodeData Name="portrait_sprite" ActionTag="-1141732522" Tag="463" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="64.0000" RightMargin="64.0000" TopMargin="44.0001" BottomMargin="83.9999" ctype="SpriteObjectData">
                        <Size X="72.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="119.9999" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.6000" />
                        <PreSize X="0.3600" Y="0.3600" />
                        <FileData Type="Normal" Path="GPSUI/default_img.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="ip_label" ActionTag="330412303" Tag="832" IconVisible="False" LeftMargin="0.4176" RightMargin="-0.4176" TopMargin="21.3670" BottomMargin="158.6330" IsCustomSize="True" FontSize="20" LabelText="192.168.255.255" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="200.0000" Y="20.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.4176" Y="168.6330" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="132" G="102" B="20" />
                        <PrePosition X="0.5021" Y="0.8432" />
                        <PreSize X="1.0000" Y="0.1000" />
                        <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="413.0000" Y="362.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5012" Y="0.8227" />
                    <PreSize X="0.2427" Y="0.4545" />
                    <FileData Type="Normal" Path="GPSUI/other_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="player_panel_3" ActionTag="1218085105" VisibleForFrame="False" Tag="457" IconVisible="False" LeftMargin="-12.6473" RightMargin="636.6473" TopMargin="121.0000" BottomMargin="119.0000" TouchEnable="True" ClipAble="False" BackColorAlpha="102" ColorAngle="90.0000" LeftEage="25" RightEage="25" TopEage="38" BottomEage="38" Scale9OriginX="25" Scale9OriginY="38" Scale9Width="28" Scale9Height="42" ctype="PanelObjectData">
                    <Size X="200.0000" Y="200.0000" />
                    <Children>
                      <AbstractNodeData Name="portrait_sprite" ActionTag="-1634656218" Tag="458" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="64.0000" RightMargin="64.0000" TopMargin="44.0001" BottomMargin="83.9999" ctype="SpriteObjectData">
                        <Size X="72.0000" Y="72.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="100.0000" Y="119.9999" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.6000" />
                        <PreSize X="0.3600" Y="0.3600" />
                        <FileData Type="Normal" Path="GPSUI/default_img.png" Plist="" />
                        <BlendFunc Src="1" Dst="771" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="ip_label" ActionTag="264475532" Tag="833" IconVisible="False" LeftMargin="-1.5682" RightMargin="1.5682" TopMargin="160.2148" BottomMargin="19.7852" IsCustomSize="True" FontSize="20" LabelText="192.168.255.255" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="200.0000" Y="20.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="98.4318" Y="29.7852" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="132" G="102" B="20" />
                        <PrePosition X="0.4922" Y="0.1489" />
                        <PreSize X="1.0000" Y="0.1000" />
                        <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint />
                    <Position X="-12.6473" Y="119.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="-0.0153" Y="0.2705" />
                    <PreSize X="0.2427" Y="0.4545" />
                    <FileData Type="Normal" Path="GPSUI/other_img.png" Plist="" />
                    <SingleColor A="255" R="150" G="200" B="255" />
                    <FirstColor A="255" R="150" G="200" B="255" />
                    <EndColor A="255" R="255" G="255" B="255" />
                    <ColorVector ScaleY="1.0000" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_0_1" ActionTag="1754749226" VisibleForFrame="False" Tag="470" RotationSkewX="-17.0000" RotationSkewY="-17.0000" IconVisible="False" LeftMargin="354.0000" TopMargin="320.5000" BottomMargin="118.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="589.0000" Y="119.0000" />
                    <Scale ScaleX="0.6000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7148" Y="0.2705" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_0_1" ActionTag="-18264488" VisibleForFrame="False" Tag="459" RotationSkewX="-16.9992" RotationSkewY="-17.0019" IconVisible="False" LeftMargin="499.6705" RightMargin="124.3295" TopMargin="327.3609" BottomMargin="92.6391" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="599.6705" Y="102.6391" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.7278" Y="0.2333" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_1_3" ActionTag="-1510660073" VisibleForFrame="False" Tag="471" IconVisible="False" LeftMargin="179.0000" RightMargin="175.0000" TopMargin="224.5000" BottomMargin="214.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="414.0000" Y="215.0000" />
                    <Scale ScaleX="1.2000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5024" Y="0.4886" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_1_3" ActionTag="-624839097" VisibleForFrame="False" Tag="460" RotationSkewY="-0.0017" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="146.2112" RightMargin="477.7888" TopMargin="195.5107" BottomMargin="224.4893" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="246.2112" Y="234.4893" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.2988" Y="0.5329" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_0_3" ActionTag="626862868" VisibleForFrame="False" Tag="473" RotationSkewX="17.0000" RotationSkewY="17.0000" IconVisible="False" LeftMargin="-1.0000" RightMargin="355.0000" TopMargin="321.5000" BottomMargin="117.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="234.0000" Y="118.0000" />
                    <Scale ScaleX="0.6000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.2840" Y="0.2682" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_0_3" ActionTag="-899391144" VisibleForFrame="False" Tag="461" RotationSkewX="16.9992" RotationSkewY="16.9964" IconVisible="False" LeftMargin="135.6736" RightMargin="488.3264" TopMargin="330.3608" BottomMargin="89.6392" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="235.6736" Y="99.6392" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.2860" Y="0.2265" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_1_2" ActionTag="1093211798" VisibleForFrame="False" Tag="474" RotationSkewX="17.0000" RotationSkewY="17.0000" IconVisible="False" LeftMargin="356.0000" RightMargin="-2.0000" TopMargin="117.5000" BottomMargin="321.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="591.0000" Y="322.0000" />
                    <Scale ScaleX="0.6000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.7172" Y="0.7318" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_1_2" ActionTag="-510660145" VisibleForFrame="False" Tag="464" RotationSkewX="16.9994" RotationSkewY="16.9994" IconVisible="False" LeftMargin="501.6700" RightMargin="122.3300" TopMargin="88.5127" BottomMargin="331.4873" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="601.6700" Y="341.4873" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.7302" Y="0.7761" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_0_2" ActionTag="-1085332733" VisibleForFrame="False" Tag="475" RotationSkewX="90.0000" RotationSkewY="90.0000" IconVisible="False" LeftMargin="179.0000" RightMargin="175.0000" TopMargin="223.5000" BottomMargin="215.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="414.0000" Y="216.0000" />
                    <Scale ScaleX="0.2500" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5024" Y="0.4909" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_0_2" ActionTag="-227767436" VisibleForFrame="False" Tag="465" RotationSkewX="-90.0000" RotationSkewY="-90.0000" IconVisible="False" LeftMargin="333.4402" RightMargin="290.5598" TopMargin="197.8463" BottomMargin="222.1537" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="433.4402" Y="232.1537" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.5260" Y="0.5276" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="line_img_2_3" ActionTag="585169589" VisibleForFrame="False" Tag="472" RotationSkewX="-17.0000" RotationSkewY="-17.0000" IconVisible="False" RightMargin="354.0000" TopMargin="117.5000" BottomMargin="321.5000" LeftEage="155" RightEage="155" Scale9OriginX="155" Scale9Width="160" Scale9Height="1" ctype="ImageViewObjectData">
                    <Size X="470.0000" Y="1.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="235.0000" Y="322.0000" />
                    <Scale ScaleX="0.6000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.2852" Y="0.7318" />
                    <PreSize X="0.5704" Y="0.0023" />
                    <FileData Type="Normal" Path="GPSUI/line_img.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dis_label_2_3" ActionTag="-902524779" VisibleForFrame="False" Tag="466" RotationSkewX="-17.0002" RotationSkewY="-17.0010" IconVisible="False" LeftMargin="133.6700" RightMargin="490.3300" TopMargin="89.5100" BottomMargin="330.4900" IsCustomSize="True" FontSize="20" LabelText="未知距离&#xA;" HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="200.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="233.6700" Y="340.4900" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="244" G="45" B="44" />
                    <PrePosition X="0.2836" Y="0.7738" />
                    <PreSize X="0.2427" Y="0.0455" />
                    <FontResource Type="Normal" Path="zhunyuan.ttf" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="310.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.4306" />
                <PreSize X="0.6438" Y="0.6111" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="title_img" ActionTag="288733291" Tag="211" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="530.0000" RightMargin="530.0000" TopMargin="102.1520" BottomMargin="549.8480" LeftEage="29" RightEage="29" TopEage="15" BottomEage="15" Scale9OriginX="29" Scale9OriginY="15" Scale9Width="162" Scale9Height="38" ctype="ImageViewObjectData">
                <Size X="220.0000" Y="68.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="583.8480" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8109" />
                <PreSize X="0.1719" Y="0.0944" />
                <FileData Type="Normal" Path="GPSUI/title_img.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="return_btn" ActionTag="587707902" Tag="795" IconVisible="False" LeftMargin="820.0937" RightMargin="257.9063" TopMargin="531.6182" BottomMargin="114.3818" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="172" Scale9Height="52" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="202.0000" Y="74.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="921.0937" Y="151.3818" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7196" Y="0.2103" />
                <PreSize X="0.1578" Y="0.1028" />
                <TextColor A="255" R="65" G="65" B="70" />
                <NormalFileData Type="Normal" Path="GPSUI/back_btn.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="dissroom_btn" ActionTag="1895518458" Tag="794" IconVisible="False" LeftMargin="260.6340" RightMargin="817.3660" TopMargin="531.6182" BottomMargin="114.3818" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="172" Scale9Height="52" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="202.0000" Y="74.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="361.6340" Y="151.3818" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2825" Y="0.2103" />
                <PreSize X="0.1578" Y="0.1028" />
                <TextColor A="255" R="65" G="65" B="70" />
                <NormalFileData Type="Normal" Path="GPSUI/dissroom_btn.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="1.0000" Y="1.0000" />
            <FileData Type="Normal" Path="BackGround/medium_win.png" Plist="" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>